import React, { createContext, useContext, useState } from "react";
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
            updateTodayNutrition({
              updatedCalculatedNutritions,
              calorie: updatedCalorie,
            });
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
          if (!response) return;
          const updatedCalculatedNutritions = calculateNutrition(response);
          setCalculatedNutrition(updatedCalculatedNutritions);
          const calorieBurnedValue = await fetchExercises(uid);
          const updatedCalorie =
            updatedCalculatedNutritions.calorie - calorieBurnedValue > 0
              ? updatedCalculatedNutritions.calorie - calorieBurnedValue
              : 0;
          updateTodayNutrition({
            updatedCalculatedNutritions,
            calorie: updatedCalorie,
          });
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
        if (todayDate === date) {
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
            updateTodayNutrition(calcualtedValue);
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

  // const calculateWeeklyCalorie = async (uid) => {
  //   try {
  //     const response = await getWeeklyNutritionValues(uid);
  //     if (response) {
  //       console.log(
  //         "wekly response of the data is RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR",
  //         response
  //       );
  //       setWeeklyNutritionData(response);
  //     } else {
  //       setWeeklyNutritionData([]);
  //     }
  //   } catch (e) {
  //     Toast.show("Something went wrong", Toast.LONG);

  //     console.log("error while fetching weakly nutirtions", e);
  //   }
  // };

  const calculateWeeklyCalorie = async (uid) => {
    try {
      const response = await getWeeklyNutritionValues(uid);
      if (response) {
        console.log(
          "Weekly response of the data isISISISISISISIISSISSIISISISISISISISISISISISISISSISISIISISSISISISISISISISI:",
          response
        );
        const formattedData = {
          calories: formatDataForChart(response, "calories"),
          protein: formatDataForChart(response, "protein"),
          fats: formatDataForChart(response, "fats"),
          carbs: formatDataForChart(response, "carbs"),
        };
        console.log(
          "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
          formattedData
        );
        setWeeklyNutritionData(formattedData);
      } else {
        setWeeklyNutritionData({
          calories: [],
          protein: [],
          fats: [],
          carbs: [],
        });
      }
    } catch (e) {
      Toast.show("Something went wrong", Toast.LONG);
      console.log("Error while fetching weekly nutrition data:", e);
    }
  };

  // const updateTodayNutrition = (calculatedNutrition) => {
  //   const today = new Date();
  //   const dayFullName = format(today, "EEE");
  //   const updatedWeeklyData = weeklyNutritionData.map((day) => {
  //     if (day.label === dayFullName) {
  //       return {
  //         ...day,
  //         calories: Number(calculatedNutrition.calorie),
  //         protein: Number(calculatedNutrition.protein),
  //         fats: Number(calculatedNutrition.fat),
  //         carbs: Number(calculatedNutrition.carbs),
  //       };
  //     }
  //     return day;
  //   });
  //   setWeeklyNutritionData(updatedWeeklyData);
  // };
  const updateTodayNutrition = (calculatedNutrition) => {
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
      calories: updateDayData(weeklyNutritionData.calories, "calories"),
      protein: updateDayData(weeklyNutritionData.protein, "protein"),
      fats: updateDayData(weeklyNutritionData.fats, "fat"),
      carbs: updateDayData(weeklyNutritionData.carbs, "carbs"),
    });
  };

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
        if (parsedResponse?.ingredients.length > 0) {
          let calories = 0;
          let fat = 0;
          let carbs = 0;
          let protein = 0;
          let quantity = 0;
          parsedResponse?.ingredients?.forEach((item) => {
            console.log(
              `item is =`,
              item,
              "calorie is ",
              calories,
              "  fat is   ",
              fat,
              "    carbs   is    ",
              carbs,
              "     protein is ",
              protein
            );
            calories += Number(item?.calories) || 0;
            fat += Number(item?.fat) || 0;
            carbs += Number(item?.carbs) || 0;
            protein += Number(item?.protein) || 0;
            if (
              item?.quantity[1] === "grams" ||
              item?.quantity[1] === "ml" ||
              item?.quantity[1] === "g"
            ) {
              quantity += Number(item?.quantity[0]) || 0;
            }
          });
          setMealInfo({
            ...parsedResponse,
            calories,
            fat,
            protein,
            carbs,
            quantity: [quantity, parsedResponse?.quantity[1]],
          });
        } else {
          setMealInfo(parsedResponse);
        }
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
        console.log(
          "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
          nutritionInfo
        );

        let parsedNutritionInfo;
        parsedNutritionInfo = JSON.parse(nutritionInfo);
        console.log(
          "IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
          parsedNutritionInfo
        );
        setFoodImage(foodImage);
        if (parsedNutritionInfo?.ingredients.length > 0) {
          let calories = 0;
          let fat = 0;
          let carbs = 0;
          let protein = 0;
          let quantity = 0;
          parsedNutritionInfo?.ingredients?.forEach((item) => {
            console.log(
              "foreachfprecachfprecagcafoecfacgavfoecfacfaacoevftcsgcagv"
            );
            calories += Number(item?.calories) || 0;
            fat += Number(item?.fat) || 0;
            carbs += Number(item?.carbs) || 0;
            protein += Number(item?.protein) || 0;
            if (
              item?.quantity[1] === "grams" ||
              item?.quantity[1] === "ml" ||
              item?.quantity[1] === "g"
            ) {
              quantity += Number(item?.quantity[0]) || 0;
            }
          });
          setMealInfo({
            ...parsedNutritionInfo,
            calories,
            fat,
            protein,
            carbs,
            quantity: [quantity, parsedNutritionInfo?.quantity[1]],
          });
        } else {
          setMealInfo(parsedNutritionInfo);
        }
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

        updateTodayNutrition({
          ...calculatedNutrition,
          calorie: updatedCalorie,
        });

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

  const deleteFoodIngredient = (index) => {
    const updatedMealInfo = mealInfo?.ingredients?.filter(
      (_, i) => i !== index
    );
    setMealInfo({ ...mealInfo, ingredients: updatedMealInfo });
  };

  const resetMealInfo = () => {
    setMealInfo(null);
  };

  const updateMealIngredient = async (additionalIngredients) => {
    try {
      const response = await updateIngredient(mealInfo, additionalIngredients);
      if (response?.data?.data) {
        const fetchedRespose = response?.data?.data;
        const parsedResponse = JSON.parse(fetchedRespose);
        if (parsedResponse?.ingredients.length > 0) {
          let calories = 0;
          let fat = 0;
          let carbs = 0;
          let protein = 0;
          let quantity = 0;
          parsedResponse?.ingredients?.forEach((item) => {
            calories += Number(item?.calories) || 0;
            fat += Number(item?.fat) || 0;
            carbs += Number(item?.carbs) || 0;
            protein += Number(item?.protein) || 0;
            if (
              item?.quantity[1] === "grams" ||
              item?.quantity[1] === "ml" ||
              item?.quantity[1] === "g"
            ) {
              quantity += Number(item?.quantity[0]) || 0;
            }
          });
          setMealInfo({
            ...parsedResponse,
            calories,
            fat,
            protein,
            carbs,
            quantity: [quantity, parsedResponse?.quantity[1]],
          });
        } else {
          setMealInfo(parsedResponse);
        }
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

  const savedFoodInBackend = async (uid, foodId, meal) => {
    try {
      const response = await saveFood(uid, foodId);
      if (response?.food) {
        setSavedFood(response?.food);
        const updatedMeal = meals[`${meal}`]?.food_items?.filter((item) => {
          if (item._id === foodId) {
            return { ...item, isSaved: true };
          } else {
            item;
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
            item;
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
      if (response) {
        console.log(
          "noerrrorrororrorororrororororororororororroroororororororrorororoororororororororororo",
          response,
          "     ",
          response?.food
        );
        setSavedFood(response);
      } else {
        setSavedFood([]);
      }
    } catch (e) {
      Toast.show("something went wrong", Toast.LONG);

      console.log(
        "error while get food item?????KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
        e
      );
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
        deleteFoodIngredient,
        resetMealInfo,
        updateMealIngredient,
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
