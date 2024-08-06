import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { FoodItem, Item } from "../models/Meals/FoodItem.models.js";
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

  if (!mealData || !meal || !uid || !date) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const { name, quantity, calories, protein, carbs, fat, items } = mealData;

  console.log(mealData);

  const mainFoodItem = new FoodItem({
    name,
    foodImage: foodImage,
    calories: parseFloat(calories),
    carbs: parseFloat(carbs),
    protein: parseFloat(protein),
    fat: parseFloat(fat),
    quantity: Array.isArray(quantity) ? quantity : [quantity],
    items: [],
  });

  await mainFoodItem.save();

  const itemDocuments = items.map((item) => ({
    name: item.name,
    calories: parseFloat(item.calories),
    carbs: parseFloat(item.carbs),
    protein: parseFloat(item.protein),
    fat: parseFloat(item.fat),
    quantity: Array.isArray(item.quantity) ? item.quantity : [item.quantity],
    ingredients: item.ingredients,
  }));

  const insertedItems = await Item.insertMany(itemDocuments);

  mainFoodItem.items = insertedItems.map((item) => item._id);
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

  const populatedDailyMeal = await DailyMeals.findOne({ user: user._id, date })
    .populate({
      path: "breakfast",
      populate: {
        path: "food_items",
        populate: { path: "items" },
      },
    })
    .populate({
      path: "lunch",
      populate: {
        path: "food_items",
        populate: { path: "items" },
      },
    })
    .populate({
      path: "snack",
      populate: {
        path: "food_items",
        populate: { path: "items" },
      },
    })
    .populate({
      path: "dinner",
      populate: {
        path: "food_items",
        populate: { path: "items" },
      },
    });

  res
    .status(201)
    .json(new ApiResponse(201, populatedDailyMeal, "Meal added successfully"));
});

export const getDailyMeals = asyncHandler(async (req, res, next) => {
  const { uid, date } = req.query;

  if (!uid || !date) {
    throw new ApiError(400, "User and date are required");
  }

  const user = await User.findOne({ uid });

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
          path: "items",
          model: "Item",
        },
      },
    })
    .exec();

  if (!dailyMeals) {
    return res
      .status(200)
      .json(new ApiResponse(201, null, "No daily meals found"));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, dailyMeals, "Daily meals retrieved successfully")
    );
});

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

  const savedFood = await SavedFood.findOne({ user: user._id });
  if (savedFood) {
    savedFood.food = savedFood.food.filter(
      (item) => item.toString() !== foodItemId
    );
    await savedFood.save();
  }

  const foodItem = await FoodItem.findById(foodItemId);
  if (foodItem) {
    await FoodItem.findByIdAndDelete(foodItemId);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Food item deleted successfully"));
});

export { deleteFoodFromMeal };

export const weeklyNutritionDetail = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;

  if (!uid) {
    return next(new ApiError(400, "Invalid request data"));
  }

  const user = await User.findOne({ uid });
  if (!user) {
    return next(new ApiError(400, "User not found"));
  }

  const currentDate = new Date();
  const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 0 });

  try {
    const dailyMeals = await DailyMeals.aggregate([
      {
        $match: {
          user: user._id,
          date: {
            $gte: startOfWeekDate,
            $lte: endOfWeekDate,
          },
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "breakfast",
          foreignField: "_id",
          as: "breakfast_meal",
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "lunch",
          foreignField: "_id",
          as: "lunch_meal",
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "snack",
          foreignField: "_id",
          as: "snack_meal",
        },
      },
      {
        $lookup: {
          from: "meals",
          localField: "dinner",
          foreignField: "_id",
          as: "dinner_meal",
        },
      },
      {
        $unwind: { path: "$breakfast_meal", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$lunch_meal", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$snack_meal", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$dinner_meal", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "fooditems",
          localField: "breakfast_meal.food_items",
          foreignField: "_id",
          as: "breakfast_food_items",
        },
      },
      {
        $lookup: {
          from: "fooditems",
          localField: "lunch_meal.food_items",
          foreignField: "_id",
          as: "lunch_food_items",
        },
      },
      {
        $lookup: {
          from: "fooditems",
          localField: "snack_meal.food_items",
          foreignField: "_id",
          as: "snack_food_items",
        },
      },
      {
        $lookup: {
          from: "fooditems",
          localField: "dinner_meal.food_items",
          foreignField: "_id",
          as: "dinner_food_items",
        },
      },
      {
        $project: {
          date: 1,
          food_items: {
            $concatArrays: [
              "$breakfast_food_items",
              "$lunch_food_items",
              "$snack_food_items",
              "$dinner_food_items",
            ],
          },
        },
      },
      { $unwind: "$food_items" },
      {
        $group: {
          _id: "$date",
          total_calories: { $sum: "$food_items.calories" },
          total_protein: { $sum: "$food_items.protein" },
          total_fats: { $sum: "$food_items.fat" },
          total_carbs: { $sum: "$food_items.carbs" },
        },
      },
    ]);

    console.log("dailemmealsn fdatat", dailyMeals);

    const exercises = await Exercise.aggregate([
      {
        $match: {
          user: user._id,
          date: {
            $gte: startOfWeekDate.toISOString().split("T")[0],
            $lte: endOfWeekDate.toISOString().split("T")[0],
          },
        },
      },
      { $unwind: "$exercise" },
      {
        $lookup: {
          from: "exerciseitems",
          localField: "exercise",
          foreignField: "_id",
          as: "exercise_details",
        },
      },
      { $unwind: "$exercise_details" },
      {
        $addFields: {
          "exercise_details.caloriesBurned": {
            $toDouble: "$exercise_details.caloriesBurned",
          },
        },
      },
      {
        $group: {
          _id: "$date",
          total_calories_burned: { $sum: "$exercise_details.caloriesBurned" },
        },
      },
    ]);

    console.log("exercise data is", exercises);

    const weekDays = eachDayOfInterval({
      start: startOfWeekDate,
      end: endOfWeekDate,
    });

    const response = weekDays.map((day) => {
      const dayMeals = dailyMeals.find((dailyMeal) =>
        isSameDay(new Date(dailyMeal._id), day)
      );

      const dayExercises = exercises.find((exercise) =>
        isSameDay(new Date(exercise._id), day)
      );

      const dayNutrition = {
        date: day,
        calories: dayMeals ? dayMeals.total_calories : 0,
        protein: dayMeals ? dayMeals.total_protein : 0,
        fats: dayMeals ? dayMeals.total_fats : 0,
        carbs: dayMeals ? dayMeals.total_carbs : 0,
      };

      const totalCaloriesBurned = dayExercises
        ? dayExercises.total_calories_burned
        : 0;

      // Adjust net calories
      dayNutrition.calories = Math.max(
        0,
        dayNutrition.calories - totalCaloriesBurned
      );

      return dayNutrition;
    });

    res.status(200).json(new ApiResponse(200, response));
  } catch (error) {
    next(new ApiError(500, "Internal Server Error"));
  }
});

export const fetchFoodFromFoodItemId = asyncHandler(async (req, res, next) => {
  const { foodId } = req.query;
  if (!foodId) {
    throw new ApiError(400, "Required item is missing");
  }

  const food = await FoodItem.findOne({ _id: foodId }).populate({
    path: "items",
  });

  if (!food) {
    res.status(200).json(new ApiResponse(200, {}, "food not found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, food, "food received successfully!"));
});
