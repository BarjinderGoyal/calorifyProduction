import mongoose from "mongoose";

const SavedFoodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  food: [
    { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
  ],
});

export const SavedFood = mongoose.model("SavedFood", SavedFoodSchema);
