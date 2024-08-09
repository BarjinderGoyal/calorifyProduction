import mongoose from "mongoose";

const userWeightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weights: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "weightLog",
    },
  ],
});

const UserWeight = mongoose.model("userWeight", userWeightSchema);

export { UserWeight };
