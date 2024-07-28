import mongoose from "mongoose";

const ExerciseItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  caloriesBurned: {
    type: String,
    required: true,
  },
});

const ExerciseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  exercise: [{ type: mongoose.Schema.Types.ObjectId, ref: "ExerciseItem" }],
  date: {
    type: String,
    required: true,
  },
});

export const ExerciseItem = mongoose.model("ExerciseItem", ExerciseItemSchema);
export const Exercise = mongoose.model("Exercise", ExerciseSchema);
