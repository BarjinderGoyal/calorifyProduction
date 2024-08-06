import React, { createContext, useCallback, useContext, useState } from "react";
import { fetchMeal } from "../functions/FetchMeal";
import { logFood } from "../functions/logFood";
import { deleteFoodFromMeal } from "../functions/DeleteMeal";
import Toast from "react-native-simple-toast";
import formatDataForChart from "../functions/FormatDataForBarGraph";
import { fetchFoodDetailFromFoodId } from "../functions/FetchFoodDetailFromFoodId.js";

import { format } from "date-fns";
import { getWeeklyNutritionValues } from "../functions/FetchWeeklyNutrition";

import {
  fetchExerciseData,
  fetchNutritionsFromImage,
  fetchNutritionsFromText,
  updateIngredient,
  updateIngredientAfterDeletion,
} from "../functions/OpenAiFunctions";

import {
  saveFood,
  deletFoodFromSavedFood,
  getSavedFoodFromBackend,
} from "../functions/SaveFoodFunctions.js";

import { fetchExerciseFromDatabase } from "../functions/fetchExerciseFromDatabase";
import { logExerciseToDatabase } from "../functions/LogExercise";

const MealCreateContext = createContext();

const MealsContext = ({ children }) => {
  const [mealInfo, setMealInfo] = useState({});
  const [exerciseInfo, setExerciseInfo] = useState({});
  const [exercise, setExercise] = useState([]);
  const [meals, setMeals] = useState([]);
  // const [weeklyNutritionData, setWeeklyNutritionData] = useState([]);
  const [weeklyNutritionData, setWeeklyNutritionData] = useState({
    calories: [],
    protein: [],
    fats: [],
    carbs: [],
  });

  const [calculatedNutrition, setCalculatedNutrition] = useState({
    calorie: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  const [calorieBurned, setCalorieBurned] = useState(0);
  const [specificDateMeal, setSpecificDateMeal] = useState(null);
  const [savedFood, setSavedFood] = useState([]);

  const [foodImage, setFoodImage] = useState("");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [specificDateNutritions, setSpecificDateNutritions] = useState({
    calorie: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const [specificDateCalorieBurned, setSpecificDateCalorieBurned] = useState(0);

  const LogMeal = async (uid, data = -1) => {
    try {
      if (!selectedMeal) {
        Toast.show("meal is not selected", Toast.LONG);

        return;
      }
      let mealData = mealInfo;
      if (data !== -1) {
        mealData = data;
      }
      await logFood(uid, selectedMeal, mealData, foodImage).then(
        async (response) => {
          if (response) {
            if (response) setMeals(response);
            const updatedCalculatedNutritions = calculateNutrition(response);
            setCalculatedNutrition(updatedCalculatedNutritions);
            const updatedCalorie =
              updatedCalculatedNutritions.calorie - calorieBurned > 0
                ? updatedCalculatedNutritions.calorie - calorieBurned
                : 0;
            updateTodayNutrition(
              {
                ...updatedCalculatedNutritions,
                calorie: updatedCalorie,
              },
              weeklyNutritionData
            );
            setSelectedMeal(null);
            setFoodImage("");
          }
        }
      );
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.error("error while logging food into database", e);
    }
  };

  const fetchMeals = async (uid, day = -1, month = -1, year = -1) => {
    try {
      if (day === -1) {
        const date = format(new Date(), "yyyy-MM-dd");
        await fetchMeal(uid, date).then(async (response) => {
          if (response) setMeals(response);
          // if (!response) return;
          const updatedCalculatedNutritions = calculateNutrition(
            response || {}
          );
          setCalculatedNutrition(updatedCalculatedNutritions);
          const formattedData = await calculateWeeklyCalorie(uid);
          const calorieBurnedValue = await fetchExercises(uid);
          const updatedCalorie =
            updatedCalculatedNutritions.calorie - calorieBurnedValue > 0
              ? updatedCalculatedNutritions.calorie - calorieBurnedValue
              : 0;
          updateTodayNutrition(
            {
              ...updatedCalculatedNutritions,
              calorie: updatedCalorie,
            },
            formattedData
          );
        });
      } else {
        setSpecificDateMeal([]);
        setSpecificDateNutritions({
          calorie: 0,
          protein: 0,
          fat: 0,
          carbs: 0,
        });
        const date = new Date(year, month, day);
        const formattedDate = format(date, "yyyy-MM-dd");
        const response = await fetchMeal(uid, formattedDate);
        if (!response) {
          Toast.show("No logged meal", Toast.LONG);
        } else {
          const calculatedValue = calculateNutrition(response);
          setSpecificDateNutritions(calculatedValue);
          setSpecificDateMeal(response);
          fetchExercises(uid, day, month, year);
        }
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("error while fetching meals data from backend", e);
    }
  };

  const calculateNutrition = (response) => {
    const mealNames = ["breakfast", "lunch", "snack", "dinner"];
    let totalCount = {
      calorie: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    };

    const formatNumber = (number) => {
      number = parseFloat(number);

      if (isNaN(number)) {
        return 0; //
      }
      return Number.isInteger(number) ? number : number?.toFixed(2);
    };

    for (let index in mealNames) {
      if (response[`${mealNames[index]}`]?.food_items) {
        for (let item of response[`${mealNames[index]}`]?.food_items) {
          totalCount.calorie += parseFloat(item.calories) || 0;
          totalCount.protein += parseFloat(item.protein) || 0;
          totalCount.fat += parseFloat(item.fat) || 0;
          totalCount.carbs += parseFloat(item.carbs) || 0;
        }
      }
    }

    // Format the totals using the utility function
    totalCount.calorie = formatNumber(totalCount.calorie);
    totalCount.protein = formatNumber(totalCount.protein);
    totalCount.fat = formatNumber(totalCount.fat);
    totalCount.carbs = formatNumber(totalCount.carbs);
    return totalCount;
  };

  const deleteMeal = async (uid, meal, foodItemId, date) => {
    try {
      const response = await deleteFoodFromMeal(uid, meal, foodItemId, date);
      const todayDate = format(new Date(), "yyyy-MM-dd");
      if (response.status === 200) {
        const formattedDate = format(new Date(date), "yyyy-MM-dd");
        if (todayDate === formattedDate) {
          const { [meal]: currentMeal, ...restMeals } = meals;
          if (currentMeal) {
            const updatedFoodItems = currentMeal.food_items.filter(
              (item) => item._id !== foodItemId
            );
            const updatedMeals = {
              ...restMeals,
              [meal]: {
                ...currentMeal,
                food_items: updatedFoodItems,
              },
            };
            const updatedSavedFood = savedFood.filter(
              (item) => item._id !== foodItemId
            );

            setMeals(updatedMeals);
            setSavedFood(updatedSavedFood);
            const calcualtedValue = calculateNutrition(updatedMeals);
            setCalculatedNutrition(calcualtedValue);
            const updatedCalorie =
              calcualtedValue.calorie - calorieBurned > 0
                ? calcualtedValue.calorie - calorieBurned
                : 0;
            updateTodayNutrition(
              {
                ...calcualtedValue,
                calorie: updatedCalorie,
              },
              weeklyNutritionData
            );
          }

          Toast.show("Food is deleted successfully", Toast.LONG);
        } else {
          const { [meal]: currentMeal, ...restMeals } = specificDateMeal;

          if (currentMeal) {
            const updatedFoodItems = currentMeal.food_items.filter(
              (item) => item._id !== foodItemId
            );

            const updatedMeals = {
              ...restMeals,
              [meal]: {
                ...currentMeal,
                food_items: updatedFoodItems,
              },
            };

            setSpecificDateMeal(updatedMeals);
            const calcualtedValue = calculateNutrition(updatedMeals);
            setSpecificDateNutritions(calcualtedValue);
          }

          Toast.show("Food is deleted successfully", Toast.LONG);
        }
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("error while deleting the food  from a meal", e);
    }
  };

  const calculateWeeklyCalorie = async (uid) => {
    try {
      const response = await getWeeklyNutritionValues(uid);
      if (response) {
        const formattedData = {
          calories: formatDataForChart(response, "calories"),
          protein: formatDataForChart(response, "protein"),
          fats: formatDataForChart(response, "fats"),
          carbs: formatDataForChart(response, "carbs"),
        };

        setWeeklyNutritionData(formattedData);
        return formattedData;
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
      console.log("Error while fetching weekly nutrition data:", e);
    }
  };

  const updateTodayNutrition = useCallback(
    (calculatedNutrition, weeklyNutritionData) => {
      const today = new Date();
      const dayFullName = format(today, "EEE");

      const updateDayData = (data, key) => {
        return data.map((day) => {
          if (day.label === dayFullName) {
            return { ...day, value: Number(calculatedNutrition[key]) };
          }
          return day;
        });
      };

      setWeeklyNutritionData({
        calories: updateDayData(weeklyNutritionData.calories, "calorie"),
        protein: updateDayData(weeklyNutritionData.protein, "protein"),
        fats: updateDayData(weeklyNutritionData.fats, "fat"),
        carbs: updateDayData(weeklyNutritionData.carbs, "carbs"),
      });
    },
    [calculatedNutrition, weeklyNutritionData]
  );

  const updateSelectedMeal = (meal) => {
    setSelectedMeal(meal);
  };

  const handleFoodImage = (image) => {
    setFoodImage(image);
  };

  const fetchNutritionsFromFoodDetail = async (foodDetails) => {
    try {
      const response = await fetchNutritionsFromText(foodDetails);
      if (response?.data?.data) {
        const fetchedRespose = response?.data?.data;
        const parsedResponse = JSON.parse(fetchedRespose);
        setMealInfo(parsedResponse);
      } else {
        setMealInfo(null);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log(
        `Error while fetching nutrition information using food detail => ${e}`
      );
    }
  };

  const fetchNutritionsFromFoodImage = async (imageUri) => {
    try {
      const response = await fetchNutritionsFromImage(imageUri);

      if (response.status === 200 && response.data.success) {
        const { nutritionInfo, foodImage } = response.data.data;
        let parsedNutritionInfo;
        parsedNutritionInfo = JSON.parse(nutritionInfo);
        setFoodImage(foodImage);
        setMealInfo(parsedNutritionInfo);
      } else {
        setMealInfo(null);
        setFoodImage("");
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log(
        `Error while fetching nutrition information using food detail => ${e}`
      );
    }
  };

  const fetchExerciseFromDetail = async (exerciseDetails) => {
    try {
      // fetchExerciseData
      const response = await fetchExerciseData(exerciseDetails);
      if (response?.data?.data) {
        const fetchedRespose = response?.data?.data;
        const parsedResponse = JSON.parse(fetchedRespose);
        setExerciseInfo({ parsedResponse });
      } else {
        setExerciseInfo(null);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log(
        `Error while fetching exercise information using exercise detail => ${e}`
      );
    }
  };

  const updateExerciseInfo = (index, value) => {
    const currentValue = { ...exerciseInfo };

    if (
      currentValue.parsedResponse &&
      Array.isArray(currentValue.parsedResponse.exercises)
    ) {
      currentValue.parsedResponse.exercises =
        currentValue.parsedResponse.exercises.map((exercise, i) =>
          i === index ? { ...exercise, calories_burned: value } : exercise
        );
    }

    setExerciseInfo(currentValue);
  };

  const logExercise = async (uid) => {
    try {
      const response = await logExerciseToDatabase(
        uid,
        exerciseInfo?.parsedResponse?.exercises
      );
      if (response?.status === 201 && response?.data?.data?.exercise) {
        let totalBurnedCalorie = response?.data?.data?.exercise?.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.caloriesBurned),
          0
        );
        setCalorieBurned((prev) => totalBurnedCalorie);

        const updatedCalorie =
          calculatedNutrition.calorie - totalBurnedCalorie > 0
            ? calculatedNutrition.calorie - totalBurnedCalorie
            : 0;

        updateTodayNutrition(
          {
            ...calculatedNutrition,
            calorie: updatedCalorie,
          },
          weeklyNutritionData
        );

        setExercise((prev) => {
          return {
            prev,
            exercise: [...response?.data?.data?.exercise],
          };
        });
        setExerciseInfo(null);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);

      console.log("error while uploading exercise to databse", e);
    }
  };

  const fetchExercises = async (uid, day = -1, month = -1, year = -1) => {
    let formattedDate = "";
    if (day === -1) {
      const date = new Date();
      formattedDate = format(date, "yyyy-MM-dd");
    } else {
      const date = new Date(year, month, day);
      formattedDate = format(date, "yyyy-MM-dd");
    }
    try {
      const response = await fetchExerciseFromDatabase(uid, formattedDate);
      if (response) {
        setExercise(response);
        let totalBurnedCalorie = response?.exercise?.reduce(
          (accumulator, currentValue) =>
            accumulator + Number(currentValue.caloriesBurned),
          0
        );
        if (day === -1) {
          setCalorieBurned(totalBurnedCalorie);
          return totalBurnedCalorie;
        } else {
          setSpecificDateCalorieBurned(totalBurnedCalorie);
        }
      } else {
        setExercise(null);
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
    }
  };

  const updateMealInfo = (data) => {
    setMealInfo(data);
  };

  const resetMealInfo = () => {
    setMealInfo(null);
  };

  const updateMealIngredient = async (
    foodItem,
    additionalIngredients,
    index
  ) => {
    try {
      const response = await updateIngredient(foodItem, additionalIngredients);
      if (response?.data?.data) {
        const fetchedResponse = response.data.data;
        const parsedResponse = JSON.parse(fetchedResponse);

        if (parsedResponse) {
          // Use a callback function to update the state
          setMealInfo((prevMealInfo) => {
            const updatedItems = [...prevMealInfo.items];
            if (!updatedItems[index]) return prevMealInfo;

            const oldItem = updatedItems[index];
            const newItem = parsedResponse;

            // Calculate new totals
            const newCalories =
              Number(prevMealInfo.calories) -
              Number(oldItem.calories) +
              Number(newItem.calories);
            const newProtein =
              Number(prevMealInfo.protein) -
              Number(oldItem.protein) +
              Number(newItem.protein);
            const newFat =
              Number(prevMealInfo.fat) -
              Number(oldItem.fat) +
              Number(newItem.fat);
            const newCarbs =
              Number(prevMealInfo.carbs) -
              Number(oldItem.carbs) +
              Number(newItem.carbs);

            // Update the specific item
            updatedItems[index] = newItem;

            return {
              ...prevMealInfo,
              calories: newCalories.toString(),
              protein: newProtein.toString(),
              fat: newFat.toString(),
              carbs: newCarbs.toString(),
              items: updatedItems,
            };
          });
        }
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
      console.log(
        `Error while fetching nutrition information using food detail => ${e}`
      );
    }
  };

  const updateMealAfterIngredientDeletion = async (
    updatedMeal,
    index,
    quantity = -1
  ) => {
    try {
      const response = await updateIngredientAfterDeletion(updatedMeal);

      if (response?.data?.data) {
        const fetchedResponse = response.data.data;
        const parsedResponse = JSON.parse(fetchedResponse);

        if (quantity === -1) {
          // Use a callback function to update the state
          setMealInfo((prevMealInfo) => {
            const updatedItems = [...prevMealInfo.items];
            if (!updatedItems[index]) return prevMealInfo;

            const oldItem = updatedItems[index];
            const newItem = parsedResponse;

            // Calculate new totals
            const newCalories =
              Number(prevMealInfo.calories) -
              Number(oldItem.calories) +
              Number(newItem.calories);
            const newProtein =
              Number(prevMealInfo.protein) -
              Number(oldItem.protein) +
              Number(newItem.protein);
            const newFat =
              Number(prevMealInfo.fat) -
              Number(oldItem.fat) +
              Number(newItem.fat);
            const newCarbs =
              Number(prevMealInfo.carbs) -
              Number(oldItem.carbs) +
              Number(newItem.carbs);

            // Update the specific item
            updatedItems[index] = newItem;

            return {
              ...prevMealInfo,
              calories: newCalories.toString(),
              protein: newProtein.toString(),
              fat: newFat.toString(),
              carbs: newCarbs.toString(),
              items: updatedItems,
            };
          });
        } else {
          setMealInfo((prevMealInfo) => {
            const updatedItems = [...prevMealInfo.items];
            if (!updatedItems[index]) return prevMealInfo;

            const oldItem = updatedItems[index];
            const newItem = parsedResponse;

            // Calculate new totals
            const newCalories =
              Number(prevMealInfo.calories) -
              Number(oldItem.calories) +
              (Number(newItem.calories) / Number(newItem.quantity[0])) *
                Number(quantity);
            const newProtein =
              Number(prevMealInfo.protein) -
              Number(oldItem.protein) +
              (Number(newItem.protein) / Number(newItem.quantity[0])) *
                Number(quantity);
            const newFat =
              Number(prevMealInfo.fat) -
              Number(oldItem.fat) +
              (Number(newItem.fat) / Number(newItem.quantity[0])) *
                Number(quantity);
            const newCarbs =
              Number(prevMealInfo.carbs) -
              Number(oldItem.carbs) +
              (Number(newItem.carbs) / Number(newItem.quantity[0])) *
                Number(quantity);

            // Update the specific item
            newItem.quantity = [quantity, ...newItem.quantity.slice(1)];
            updatedItems[index] = newItem;

            return {
              ...prevMealInfo,
              calories: newCalories.toString(),
              protein: newProtein.toString(),
              fat: newFat.toString(),
              carbs: newCarbs.toString(),
              items: updatedItems,
            };
          });
        }
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
      console.log(
        `Error while fetching nutrition information using food detail => ${e}`
      );
    }
  };

  const savedFoodInBackend = async (uid, foodId, meal) => {
    try {
      const response = await saveFood(uid, foodId);
      if (response?.food) {
        setSavedFood(response?.food);
        const updatedMeal = meals[`${meal}`]?.food_items?.filter((item) => {
          if (item._id === foodId) {
            return { ...item, isSaved: true };
          } else {
            return item;
          }
        });

        setMeals({
          ...meals,
          [meal]: { ...meals[`${meal}`], food_items: updatedMeal },
        });
      } else {
        setSavedFood([]);
      }
    } catch (e) {
      Toast.show("something went wrong", Toast.LONG);

      console.log("error while saving food item", e);
    }
  };

  const deleteSavedFood = async (uid, foodId, meal) => {
    try {
      const response = await deletFoodFromSavedFood(uid, foodId);
      if (response?.food) {
        setSavedFood(response?.food);
        const updatedMeal = meals[`${meal}`]?.food_items?.filter((item) => {
          if (item._id === foodId) {
            return { ...item, isSaved: false };
          } else {
            return item;
          }
        });

        setMeals({
          ...meals,
          [meal]: { ...meals[`${meal}`], food_items: updatedMeal },
        });
      } else {
        setSavedFood([]);
      }
    } catch (e) {
      Toast.show("something went wrong", Toast.LONG);

      console.log("error while delete food item", e);
    }
  };

  const getMySavedFood = async (uid) => {
    try {
      const response = await getSavedFoodFromBackend(uid);
      if (response?.food) {
        setSavedFood(response?.food);
      } else {
        setSavedFood([]);
      }
    } catch (e) {
      Toast.show("something went wrong", Toast.LONG);
    }
  };

  const fetchFoodFromFoodItemId = async (foodId) => {
    try {
      const response = await fetchFoodDetailFromFoodId(foodId);
      if (response) {
        setMealInfo(response);
      } else {
        setMealInfo({});
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
      console.error("error while fetching food from svaed food id", e);
    }
  };

  return (
    <MealCreateContext.Provider
      value={{
        meals,
        fetchMeals,
        specificDateMeal,
        specificDateNutritions,
        selectedMeal,
        updateSelectedMeal,
        deleteMeal,
        calculatedNutrition,
        weeklyNutritionData,
        LogMeal,
        calculateWeeklyCalorie,
        foodImage,
        handleFoodImage,
        mealInfo,
        exerciseInfo,
        exercise,
        calorieBurned,
        specificDateCalorieBurned,
        fetchNutritionsFromFoodDetail,
        fetchNutritionsFromFoodImage,
        fetchExerciseFromDetail,
        updateMealInfo,
        resetMealInfo,
        updateMealIngredient,
        updateMealAfterIngredientDeletion,
        updateExerciseInfo,
        logExercise,
        fetchExercises,
        savedFoodInBackend,
        deleteSavedFood,
        getMySavedFood,
        savedFood,
        fetchFoodFromFoodItemId,
      }}
    >
      {children}
    </MealCreateContext.Provider>
  );
};

export default MealsContext;

export const useMealsContext = () => useContext(MealCreateContext);
