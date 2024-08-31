export const calculateDailyCalorieIntake = (
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
  const dailyCalorieIntake = adjustForWeightGoal(tdee, weeklyGoal, goal);

  return dailyCalorieIntake;
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
