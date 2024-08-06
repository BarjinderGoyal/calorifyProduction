// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const createAccount = async (
//   uid,
//   userName,
//   email,
//   age,
//   userHeight,
//   weight,
//   gender,
//   goal,
//   goalWeight,
//   activityLevel,
//   weeklyGoal
// ) => {
//   try {
//     if (
//       !uid ||
//       !userName ||
//       !email ||
//       !age ||
//       !userHeight ||
//       !weight ||
//       !goal ||
//       !activityLevel ||
//       !weeklyGoal ||
//       !goalWeight ||
//       !gender
//     ) {
//       return;
//     }
//     let heightInCm = userHeight[0];
//     if (userHeight[1] === "ft") {
//       console.log(userHeight[0].ft, userHeight[0].in);
//       heightInCm = heightInFeetAndInchesToCm(
//         Number(userHeight[0].ft),
//         Number(userHeight[0].in)
//       );
//     }

//     const dailyCalorieValue = calculateDailyCaloricIntake(
//       Number(weight),
//       Number(weeklyGoal),
//       gender,
//       Number(age),
//       Number(heightInCm),
//       Number(activityLevel),
//       goal
//     );

//     console.log(dailyCalorieValue, " calculted value of calorie");

//     const response = await axios.post(
//       "http://calorify.us-east-1.elasticbeanstalk.com/api/v1/user/register",
//       {
//         uid,
//         userName,
//         email,
//         age: Number(age),
//         gender,
//         height: Number(heightInCm),
//         weight: Number(weight),
//         goal,
//         activityLevel: Number(activityLevel),
//         weeklyGoal: Number(weeklyGoal),
//         goalWeight: Number(goalWeight),
//         dailyCalorieValue: Number(dailyCalorieValue),
//         hasSeenFirstTimePaywall: false,
//         hasUsedFreeLogging: false,
//       }
//     );
//     return response;
//   } catch (e) {
//     throw new Error(e);
//   }
// };

// function heightInFeetAndInchesToCm(feet, inches) {
//   const cmPerFoot = 30.48;
//   const cmPerInch = 2.54;

//   // Convert feet to cm and inches to cm, then sum them up
//   const heightInCm = feet * cmPerFoot + inches * cmPerInch;

//   return heightInCm;
// }

// const calculateDailyCaloricIntake = (
//   weight,
//   weeklyGoal,
//   gender,
//   age,
//   height,
//   activityLevel,
//   goal
// ) => {
//   // Calculate BMR
//   const bmr = calculateBMR(weight, height, age, gender);

//   // Calculate TDEE
//   const tdee = calculateTDEE(bmr, activityLevel);

//   // Adjust for weight goals
//   const dailyCaloricIntake = adjustForWeightGoal(tdee, weeklyGoal, goal);

//   return dailyCaloricIntake;
// };

// const calculateBMR = (weight, height, age, gender) => {
//   if (gender === "male") {
//     return 10 * weight + 6.25 * height - 5 * age + 5;
//   } else {
//     return 10 * weight + 6.25 * height - 5 * age - 161;
//   }
// };

// const calculateTDEE = (bmr, activityLevel) => {
//   return bmr * activityLevel;
// };

// const adjustForWeightGoal = (tdee, weeklyGoal, goal) => {
//   // 1 kg of fat is roughly 7700 calories
//   const caloricAdjustment = (weeklyGoal * 7700) / 7;

//   if (goal === "Maintain weight") {
//     return tdee;
//   } else if (goal === "Loose weight") {
//     return tdee - caloricAdjustment;
//   } else if (goal === "Gain weight") {
//     return tdee + caloricAdjustment;
//   } else {
//     throw new Error('Invalid goal. Choose "maintain", "Loose", or "Gain".');
//   }
// };

// function calculateDailyIntake(
//   age,
//   weight,
//   height,
//   gender,
//   activityLevel,
//   goal,
//   weeklyGoal
// ) {
//   // BMR calculation using Mifflin-St Jeor Equation
//   let bmr;
//   if (gender === "male") {
//     bmr = 10 * weight + 6.25 * height - 5 * age + 5;
//   } else {
//     bmr = 10 * weight + 6.25 * height - 5 * age - 161;
//   }

//   // TDEE calculation based on activity level
//   const activityFactors = {
//     sedentary: 1.2,
//     lightlyActive: 1.375,
//     moderatelyActive: 1.55,
//     veryActive: 1.725,
//     superActive: 1.9,
//   };

//   const tdee = bmr * (activityLevel || 1.2);

//   // Adjust TDEE based on goal weight and weekly goal
//   const calorieAdjustment = (weeklyGoal * 7700) / 7; // 7700 calories is roughly equivalent to 1 kg of body weight
//   let adjustedTdee;
//   if (goal === "Loose weight") {
//     adjustedTdee = tdee - calorieAdjustment;
//   } else if (goal === "Gain weight") {
//     adjustedTdee = tdee + calorieAdjustment;
//   } else {
//     adjustedTdee = tdee; // maintenance
//   }

//   // Macronutrient ratios based on goal
//   const macronutrientRatios = {
//     "Maintain weight": { protein: 0.3, fat: 0.25, carbs: 0.45 },
//     "Loose weight": { protein: 0.4, fat: 0.4, carbs: 0.2 },
//     "Gain weight": { protein: 0.4, fat: 0.3, carbs: 0.3 },
//   };

//   const ratios =
//     macronutrientRatios[goal] || macronutrientRatios["Maintain weight"];

//   // Calculate daily intake of protein, carbs, and fat in grams
//   const dailyProtein = (adjustedTdee * ratios.protein) / 4;
//   const dailyFat = (adjustedTdee * ratios.fat) / 9;
//   const dailyCarbs = (adjustedTdee * ratios.carbs) / 4;

//   return {
//     protein: dailyProtein,
//     fat: dailyFat,
//     carbs: dailyCarbs,
//   };
// }

// // Example usage:
// const age = 30;
// const weight = 80; // in kg
// const height = 175; // in cm
// const gender = "male";
// const activityLevel = "moderatelyActive";
// const goal = "weightLoss"; // can be 'maintenance', 'weightLoss', or 'muscleGain'
// const goalWeight = 75; // target weight in kg
// const weeklyGoal = 0.5; // weight loss or gain per week in kg

// const dailyIntake = calculateDailyIntake(
//   age,
//   weight,
//   height,
//   gender,
//   activityLevel,
//   goal,
//   goalWeight,
//   weeklyGoal
// );
// console.log(dailyIntake); // { protein: ..., fat: ..., carbs: ... }

import axios from "axios";

// import { BASE_ENDPOINT_URL } from "../Constants";

export const createAccount = async (
  uid,
  userName,
  email,
  age,
  userHeight,
  weight,
  gender,
  goal,
  goalWeight,
  activityLevel,
  weeklyGoal
) => {
  try {
    console.log(userHeight, goalWeight, weeklyGoal);
    if (
      !uid ||
      !userName ||
      !email ||
      !age ||
      !userHeight ||
      !weight ||
      !goal ||
      !activityLevel ||
      !weeklyGoal ||
      !goalWeight ||
      !gender
    ) {
      return;
    }
    console.log("trying to create an account");

    const dailyCalorieValue = calculateDailyCaloricIntake(
      Number(weight),
      Number(weeklyGoal),
      gender,
      Number(age),
      Number(userHeight),
      Number(activityLevel),
      goal
    );
    if (dailyCalorieValue <= 0) {
      throw new Error("User information is incorrect.");
      return;
    }
    console.log(dailyCalorieValue, " calculted value of calorie");

    const response = await axios.post(
      `http://192.168.31.209:8000/api/v1/user/register`,
      {
        uid,
        userName,
        email,
        age: Number(age),
        gender,
        height: Number(userHeight),
        weight: Number(weight),
        goal,
        activityLevel: Number(activityLevel),
        weeklyGoal: Number(weeklyGoal),
        goalWeight: Number(goalWeight),
        dailyCalorieValue: Number(dailyCalorieValue),
      }
    );
    return response;
  } catch (e) {
    throw new Error(e);
  }
};

const calculateDailyCaloricIntake = (
  weight,
  weeklyGoal,
  gender,
  age,
  height,
  activityLevel,
  goal
) => {
  // Calculate BMR
  const bmr = calculateBMR(weight, height, age, gender);

  // Calculate TDEE
  const tdee = calculateTDEE(bmr, activityLevel);

  // Adjust for weight goals
  const dailyCaloricIntake = adjustForWeightGoal(tdee, weeklyGoal, goal);

  return dailyCaloricIntake;
};

const calculateBMR = (weight, height, age, gender) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

const calculateTDEE = (bmr, activityLevel) => {
  return bmr * activityLevel;
};

const adjustForWeightGoal = (tdee, weeklyGoal, goal) => {
  // 1 kg of fat is roughly 7700 calories
  const caloricAdjustment = (weeklyGoal * 7700) / 7;

  if (goal === "Maintain weight") {
    return tdee;
  } else if (goal === "Loose weight") {
    return tdee - caloricAdjustment;
  } else if (goal === "Gain weight") {
    return tdee + caloricAdjustment;
  } else {
    throw new Error('Invalid goal. Choose "maintain", "Loose", or "Gain".');
  }
};

function calculateDailyIntake(
  age,
  weight,
  height,
  gender,
  activityLevel,
  goal,
  weeklyGoal
) {
  // BMR calculation using Mifflin-St Jeor Equation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE calculation based on activity level
  const activityFactors = {
    sedentary: 1.2,
    lightlyActive: 1.375,
    moderatelyActive: 1.55,
    veryActive: 1.725,
    superActive: 1.9,
  };

  const tdee = bmr * (activityLevel || 1.2);

  // Adjust TDEE based on goal weight and weekly goal
  const calorieAdjustment = (weeklyGoal * 7700) / 7; // 7700 calories is roughly equivalent to 1 kg of body weight
  let adjustedTdee;
  if (goal === "Loose weight") {
    adjustedTdee = tdee - calorieAdjustment;
  } else if (goal === "Gain weight") {
    adjustedTdee = tdee + calorieAdjustment;
  } else {
    adjustedTdee = tdee; // maintenance
  }

  // Macronutrient ratios based on goal
  const macronutrientRatios = {
    "Maintain weight": { protein: 0.3, fat: 0.25, carbs: 0.45 },
    "Loose weight": { protein: 0.4, fat: 0.4, carbs: 0.2 },
    "Gain weight": { protein: 0.4, fat: 0.3, carbs: 0.3 },
  };

  const ratios =
    macronutrientRatios[goal] || macronutrientRatios["Maintain weight"];

  // Calculate daily intake of protein, carbs, and fat in grams
  const dailyProtein = (adjustedTdee * ratios.protein) / 4;
  const dailyFat = (adjustedTdee * ratios.fat) / 9;
  const dailyCarbs = (adjustedTdee * ratios.carbs) / 4;

  return {
    protein: dailyProtein,
    fat: dailyFat,
    carbs: dailyCarbs,
  };
}

// Example usage:
const age = 30;
const weight = 80; // in kg
const height = 175; // in cm
const gender = "male";
const activityLevel = "moderatelyActive";
const goal = "weightLoss"; // can be 'maintenance', 'weightLoss', or 'muscleGain'
const goalWeight = 75; // target weight in kg
const weeklyGoal = 0.5; // weight loss or gain per week in kg

const dailyIntake = calculateDailyIntake(
  age,
  weight,
  height,
  gender,
  activityLevel,
  goal,
  goalWeight,
  weeklyGoal
);
console.log(dailyIntake); // { protein: ..., fat: ..., carbs: ... }
