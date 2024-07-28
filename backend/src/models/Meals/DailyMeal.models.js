import mongoose from "mongoose";

const dailyMealsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  breakfast: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
  lunch: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
  snack: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
  dinner: { type: mongoose.Schema.Types.ObjectId, ref: "Meal" },
});

export const DailyMeals = mongoose.model("DailyMeals", dailyMealsSchema);
