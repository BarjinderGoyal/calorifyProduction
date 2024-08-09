import mongoose from "mongoose";

// Define the schema for individual items
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number },
  carbs: { type: Number },
  protein: { type: Number },
  fat: { type: Number },
  quantity: [{ type: String }],
  ingredients: [{ type: String }],
});

// Define the schema for the main food item
const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foodImage: { type: String },
  calories: { type: Number },
  carbs: { type: Number },
  protein: { type: Number },
  fat: { type: Number },
  quantity: [{ type: String }],
  isSaved: { type: Boolean, default: false },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }], // Array of item references
});

// Create the models
export const Item = mongoose.model("Item", itemSchema);
export const FoodItem = mongoose.model("FoodItem", foodItemSchema);
