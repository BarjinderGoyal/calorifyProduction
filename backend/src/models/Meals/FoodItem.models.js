import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foodImage: { type: String },
  calories: { type: Number },
  carbs: { type: Number },
  protein: { type: Number },
  fat: { type: Number },
  quantity: [{ type: String }],
  isSaved: { type: Boolean, default: false },
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }],
});

export const FoodItem = mongoose.model("FoodItem", foodItemSchema);
