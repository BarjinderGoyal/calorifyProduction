import mongoose from "mongoose";
// const FoodItem = require("./FoodItem.models"); // Adjust the path as necessary

const mealSchema = new mongoose.Schema({
  meal_name: { type: String, required: true },
  food_items: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }], // Array of food items
});

export const Meal = mongoose.model("Meal", mealSchema);
