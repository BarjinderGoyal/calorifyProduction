export function dailyMacroIntake(
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
