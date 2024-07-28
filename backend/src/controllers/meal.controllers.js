import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FoodItem } from "../models/Meals/FoodItem.models.js";
import { Meal } from "../models/Meals/Meal.models.js";
import { User } from "../models/user/user.models.js";
import { Exercise } from "../models/Exercise/Exercise.models.js";
import { DailyMeals } from "../models/Meals/DailyMeal.models.js";
import { SavedFood } from "../models/SavedFood/SavedFood.models.js";
import {
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export const addNutrition = asyncHandler(async (req, res, next) => {
  const { uid, mealData, meal, date, foodImage } = req.body;
  console.log(
    uid,
    "     ",
    meal,
    "        ",
    mealData,
    "         ",
    date,
    "ffffff",
    foodImage,
    typeof foodImage
  );

  if (!mealData || !meal || !uid || !date) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Extract main meal information and ingredients
  const { name, quantity, calories, protein, carbs, fat, ingredients } =
    mealData;

  // Create the main food item document (the overall meal)
  const mainFoodItem = new FoodItem({
    name,
    foodImage: foodImage,
    calories: parseFloat(calories),
    carbs: parseFloat(carbs),
    protein: parseFloat(protein),
    fat: parseFloat(fat),
    quantity: Array.isArray(quantity) ? quantity : [quantity], // Ensure it's an array
    ingredients: [], // Will add ingredient IDs after creation
  });

  // Save the main food item (the overall meal)
  await mainFoodItem.save();

  // Process and save each ingredient
  const ingredientDocuments = ingredients.map((item) => ({
    name: item.name,
    calories: parseFloat(item.calories),
    carbs: parseFloat(item.carbs),
    protein: parseFloat(item.protein),
    fat: parseFloat(item.fat),
    quantity: Array.isArray(item.quantity) ? item.quantity : [item.quantity], // Ensure it's an array
  }));

  const insertedIngredients = await FoodItem.insertMany(ingredientDocuments);

  // Update the main food item with the references to the ingredient documents
  mainFoodItem.ingredients = insertedIngredients.map((item) => item._id);
  await mainFoodItem.save();

  let todayMeal = await DailyMeals.findOne({ user: user._id, date });

  if (todayMeal) {
    if (todayMeal[meal]) {
      await Meal.findByIdAndUpdate(todayMeal[meal], {
        $push: { food_items: mainFoodItem._id },
      });
    } else {
      const currentMeal = await Meal.create({
        meal_name: meal,
        food_items: [mainFoodItem._id],
      });
      todayMeal[meal] = currentMeal._id;
      await todayMeal.save();
    }
  } else {
    const currentMeal = await Meal.create({
      meal_name: meal,
      food_items: [mainFoodItem._id],
    });

    todayMeal = new DailyMeals({
      user: user._id,
      date,
      [meal]: currentMeal._id,
    });

    await todayMeal.save();
  }

  // Populate all meals and their food items, including ingredients, for the response
  const populatedDailyMeal = await DailyMeals.findOne({ user: user._id, date })
    .populate({
      path: "breakfast",
      populate: {
        path: "food_items",
        populate: { path: "ingredients" }, // Populate ingredients inside food_items
      },
    })
    .populate({
      path: "lunch",
      populate: {
        path: "food_items",
        populate: { path: "ingredients" }, // Populate ingredients inside food_items
      },
    })
    .populate({
      path: "snack",
      populate: {
        path: "food_items",
        populate: { path: "ingredients" }, // Populate ingredients inside food_items
      },
    })
    .populate({
      path: "dinner",
      populate: {
        path: "food_items",
        populate: { path: "ingredients" }, // Populate ingredients inside food_items
      },
    });

  res
    .status(201)
    .json(new ApiResponse(201, populatedDailyMeal, "Meal added successfully"));
});

// Function to get daily meals based on user and date
export const getDailyMeals = asyncHandler(async (req, res, next) => {
  const { uid, date } = req.query;

  console.log(uid, date);

  if (!uid || !date) {
    throw new ApiError(400, "User and date are required");
  }

  const user = await User.findOne({ uid });

  console.log("user is", user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const dailyMeals = await DailyMeals.findOne({ user: user._id, date })
    .populate({
      path: "breakfast lunch snack dinner",
      populate: {
        path: "food_items",
        model: "FoodItem",
        populate: {
          path: "ingredients",
          model: "FoodItem",
        },
      },
    })
    .exec();

  if (!dailyMeals) {
    // throw new ApiError(404, "No meals found for the specified date");
    return res.status(200).json(new ApiResponse(201, null));
  }

  res.status(200).json(new ApiResponse(201, dailyMeals));
}); // Delete Food item inside meal

const deleteFoodFromMeal = asyncHandler(async (req, res, next) => {
  const { uid, meal, foodItemId, date } = req.query;

  if (!uid || !meal || !foodItemId || !date) {
    return next(new ApiError(400, "Invalid request data"));
  }

  const user = await User.findOne({ uid });
  if (!user) {
    return next(new ApiError(400, "User not found"));
  }

  const dailyMeal = await DailyMeals.findOne({ user: user._id, date }).populate(
    meal
  );
  if (!dailyMeal || !dailyMeal[meal]) {
    return next(new ApiError(400, "Meal not found for the specified date"));
  }

  const mealDocument = await Meal.findById(dailyMeal[meal]._id);
  if (!mealDocument) {
    return next(new ApiError(400, "Meal not found"));
  }

  mealDocument.food_items = mealDocument.food_items.filter(
    (item) => item.toString() !== foodItemId
  );

  await mealDocument.save();

  await SavedFood.updateMany(
    { user: user._id },
    { $pull: { food: foodItemId } }
  );

  // Deleting the food item document if it exists
  const foodItem = await FoodItem.findById(foodItemId);
  if (foodItem) {
    await FoodItem.findByIdAndDelete(foodItemId);
  }

  res.status(200).json(new ApiResponse(200, "Food item deleted successfully"));
});

export { deleteFoodFromMeal };
// Update Food item inside meal
const updateFoodInMeal = asyncHandler(async (req, res, next) => {
  const { uid, meal, foodItemId, updatedFoodData, date } = req.body;

  if (!uid || !meal || !foodItemId || !updatedFoodData || !date) {
    throw new ApiError(400, "Invalid request data");
  }

  const user = await User.findOne({ uid });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const dailyMeal = await DailyMeals.findOne({ user: user._id, date }).populate(
    meal
  );
  if (!dailyMeal || !dailyMeal[meal]) {
    throw new ApiError(400, "Meal not found for the specified date");
  }

  const mealDocument = await Meal.findById(dailyMeal[meal]._id);
  if (!mealDocument) {
    throw new ApiError(400, "Meal document not found");
  }

  const foodItemIndex = mealDocument.food_items.findIndex(
    (item) => item.toString() === foodItemId
  );
  if (foodItemIndex === -1) {
    throw new ApiError(400, "Food item not found in the meal");
  }

  await FoodItem.findByIdAndUpdate(foodItemId, updatedFoodData, { new: true });

  res.status(200).json(new ApiResponse(200, "Food item updated successfully"));
});

export { updateFoodInMeal };

// export const weeklyNutritionDetail = asyncHandler(async (req, res, next) => {
//   const { uid, startDate, endDate } = req.query;

//   if (!uid) {
//     return next(new ApiError(400, "Invalid request data"));
//   }

//   const user = await User.findOne({ uid });
//   if (!user) {
//     return next(new ApiError(400, "User not found"));
//   }

//   const startOfWeekDate = parseISO(startDate);
//   const endOfTodayDate = parseISO(endDate);

//   console.log(
//     `Fetching daily meals and exercises for user ${uid} from ${startOfWeekDate} to ${endOfTodayDate}`
//   );

//   try {
//     // Fetching daily meals
//     const dailyMeals = await DailyMeals.find({
//       user: user._id,
//       date: {
//         $gte: startOfWeekDate,
//         $lte: endOfTodayDate,
//       },
//     })
//       .populate({
//         path: "breakfast",
//         populate: { path: "food_items" },
//       })
//       .populate({
//         path: "lunch",
//         populate: { path: "food_items" },
//       })
//       .populate({
//         path: "snack",
//         populate: { path: "food_items" },
//       })
//       .populate({
//         path: "dinner",
//         populate: { path: "food_items" },
//       });

//     // Fetching exercises
//     const exercises = await Exercise.find({
//       user: user._id,
//       date: {
//         $gte: startDate.split("T")[0], // Convert start date to "YYYY-MM-DD"
//         $lte: endDate.split("T")[0], // Convert end date to "YYYY-MM-DD"
//       },
//     }).populate("exercise");

//     // Debugging fetched data
//     console.log("Raw daily meals data:", dailyMeals);
//     console.log("Raw exercises data:", exercises);

//     const weekDays = eachDayOfInterval({
//       start: startOfWeekDate,
//       end: endOfTodayDate,
//     });

//     const response = weekDays.map((day) => {
//       const dayMeals = dailyMeals.find((dailyMeal) =>
//         isSameDay(new Date(dailyMeal.date), day)
//       );

//       const dayExercises = exercises.find((exercise) =>
//         isSameDay(new Date(exercise.date), day)
//       );

//       console.log(`Day: ${day}`);
//       console.log("Day meals:", dayMeals);
//       console.log("Day exercises:", dayExercises);

//       const meals = [
//         dayMeals?.breakfast,
//         dayMeals?.lunch,
//         dayMeals?.snack,
//         dayMeals?.dinner,
//       ];

//       const dayNutrition = meals.reduce(
//         (acc, meal) => {
//           if (meal && meal.food_items) {
//             meal.food_items.forEach((item) => {
//               acc.calories += item.calories;
//               acc.protein += item.protein;
//               acc.fats += item.fat;
//               acc.carbs += item.carbs;
//             });
//           }
//           return acc;
//         },
//         { date: day, calories: 0, protein: 0, fats: 0, carbs: 0 }
//       );

//       const totalCaloriesBurned = dayExercises
//         ? dayExercises.exercise.reduce((total, exerciseItem) => {
//             console.log("Exercise item:", exerciseItem);
//             return total + Number(exerciseItem.caloriesBurned);
//           }, 0)
//         : 0;

//       dayNutrition.calories = Math.max(
//         0,
//         dayNutrition.calories - totalCaloriesBurned
//       );

//       return dayNutrition;
//     });

//     console.log("WEEKLY NUTRITION RESPONSE IS ", response);
//     res.status(200).json(new ApiResponse(200, response));
//   } catch (error) {
//     console.error(error);
//     next(new ApiError(500, "Internal Server Error"));
//   }
// });

export const weeklyNutritionDetail = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;

  if (!uid) {
    return next(new ApiError(400, "Invalid request data"));
  }

  const user = await User.findOne({ uid });
  if (!user) {
    return next(new ApiError(400, "User not found"));
  }

  // Get the current date
  const currentDate = new Date();

  // Calculate the start and end dates of the current week (Sunday to Saturday)
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 }); // 0 means Sunday
  const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 }); // 0 means Sunday

  console.log(
    `Fetching daily meals and exercises for user ${uid} from ${startOfWeekDate} to ${endOfWeekDate}`
  );

  try {
    // Fetching daily meals
    const dailyMeals = await DailyMeals.find({
      user: user._id,
      date: {
        $gte: startOfWeekDate,
        $lte: endOfWeekDate,
      },
    })
      .populate({
        path: "breakfast",
        populate: { path: "food_items" },
      })
      .populate({
        path: "lunch",
        populate: { path: "food_items" },
      })
      .populate({
        path: "snack",
        populate: { path: "food_items" },
      })
      .populate({
        path: "dinner",
        populate: { path: "food_items" },
      });

    // Fetching exercises
    const exercises = await Exercise.find({
      user: user._id,
      date: {
        $gte: startOfWeekDate,
        $lte: endOfWeekDate,
      },
    }).populate("exercise");

    // Debugging fetched data
    console.log("Raw daily meals data:", dailyMeals);
    console.log("Raw exercises data:", exercises);

    const weekDays = eachDayOfInterval({
      start: startOfWeekDate,
      end: endOfWeekDate,
    });

    const response = weekDays.map((day) => {
      const dayMeals = dailyMeals.find((dailyMeal) =>
        isSameDay(new Date(dailyMeal.date), day)
      );

      const dayExercises = exercises.find((exercise) =>
        isSameDay(new Date(exercise.date), day)
      );

      console.log(`Day: ${day}`);
      console.log("Day meals:", dayMeals);
      console.log("Day exercises:", dayExercises);

      const meals = [
        dayMeals?.breakfast,
        dayMeals?.lunch,
        dayMeals?.snack,
        dayMeals?.dinner,
      ];

      const dayNutrition = meals.reduce(
        (acc, meal) => {
          if (meal && meal.food_items) {
            meal.food_items.forEach((item) => {
              acc.calories += item.calories;
              acc.protein += item.protein;
              acc.fats += item.fat;
              acc.carbs += item.carbs;
            });
          }
          return acc;
        },
        { date: day, calories: 0, protein: 0, fats: 0, carbs: 0 }
      );

      const totalCaloriesBurned = dayExercises
        ? dayExercises.exercise.reduce((total, exerciseItem) => {
            console.log("Exercise item:", exerciseItem);
            return total + Number(exerciseItem.caloriesBurned);
          }, 0)
        : 0;

      dayNutrition.calories = Math.max(
        0,
        dayNutrition.calories - totalCaloriesBurned
      );

      return dayNutrition;
    });

    console.log("WEEKLY NUTRITION RESPONSE IS ", response);
    res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    console.error(error);
    next(new ApiError(500, "Internal Server Error"));
  }
});

export const fetchFoodFromFoodItemId = asyncHandler(async (req, res, next) => {
  const { foodId } = req.query;
  console.log("foodidnis", foodId);
  if (!foodId) {
    throw new ApiError(400, "Required item is missing");
  }

  const food = await FoodItem.findOne({ _id: foodId }).populate({
    path: "ingredients",
  });

  if (!food) {
    res.status(200).json(new ApiResponse(200, {}, "food not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, food, "food received successfully!"));
});
