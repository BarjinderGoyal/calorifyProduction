import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user/user.models.js";
import { UserWeight } from "../models/Weight/UserWeight.models.js";
import { WeightLog } from "../models/Weight/WeightLog.models.js";

const addWeight = asyncHandler(async (req, res, next) => {
  const { uid, weight, date } = req.body;

  if (!uid) {
    throw new ApiError(400, "Invalid User");
  }

  if (weight === 0) {
    throw new ApiError(400, "Invalid weight");
  }

  if (!date) {
    throw new ApiError(400, "Invalid Date");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const weightLog = await WeightLog.create({
    date,
    weight,
  });

  let userWeight = await UserWeight.findOne({ user: user._id });

  if (userWeight) {
    userWeight.weights.push(weightLog);
    await userWeight.save();
  } else {
    userWeight = await UserWeight.create({
      user: user._id,
      weights: [weightLog],
    });
  }

  res
    .status(201)
    .json(new ApiResponse(201, "Weight added successfully", userWeight));
});

export { addWeight };

const getUserWeigths = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;
  if (!uid) {
    throw new ApiError(400, "Invalid User");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  const userWeight = await UserWeight.findOne({ user: user._id }).populate(
    "weights"
  );

  if (!userWeight) {
    throw new ApiError(400, "User has not log any weight");
  }

  res
    .status(201)
    .json(new ApiResponse(201, userWeight, "weight receive successfully"));
});

export { getUserWeigths };
