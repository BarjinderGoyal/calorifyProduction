import mongoose from "mongoose";

const weightLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
});

const WeightLog = mongoose.model("weightLog", weightLogSchema);

export { WeightLog };