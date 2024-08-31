import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user/user.models.js";
import { UserWeight } from "../models/Weight/UserWeight.models.js";
import { WeightLog } from "../models/Weight/WeightLog.models.js";
import { format } from "date-fns";

export const registerUser = asyncHandler(async (req, res, next) => {
  const {
    uid,
    userName,
    email,
    age,
    gender,
    height,
    weight,
    goal,
    activityLevel,
    weeklyGoal,
    goalWeight,
    dailyCalorieValue,
    hasSeenFirstTimePaywall,
    hasUsedFreeLogging,
  } = req.body;

  if (
    [uid, userName, email, goal, gender].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (
    [
      age,
      height,
      weight,
      dailyCalorieValue,
      activityLevel,
      weeklyGoal,
      goalWeight,
    ].some((field) => field === 0)
  ) {
    throw new ApiError(400, "All fields are required");
  }

  console.log(
    uid,
    userName,
    email,
    age,
    gender,
    height,
    weight,
    goal,
    activityLevel,
    weeklyGoal,
    goalWeight,
    dailyCalorieValue,
    hasSeenFirstTimePaywall,
    hasUsedFreeLogging
  );

  const existedUser = await User.findOne({ $or: [{ uid }, { email }] });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    uid,
    userName,
    email,
    age,
    gender,
    height,
    weight,
    goal,
    activityLevel,
    weeklyGoal,
    goalWeight,
    dailyCalorieValue,
    hasSeenFirstTimePaywall,
    hasUsedFreeLogging,
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the account");
  }

  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");
  const weightLog = await WeightLog.create({
    date: formattedDate,
    weight: weight,
  });

  await UserWeight.create({
    user: user._id,
    weights: [weightLog._id],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const getUser = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;
  if (!uid || uid === "") {
    throw new ApiError(400, "User is required");
  }

  console.log("uid is ", uid);
  const user = await User.findOne({ uid });

  console.log("user is ", user);

  if (!user) {
    return res
      .status(201)
      .json(new ApiResponse(201, null, "user login Successfully"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "user login Successfully"));
});

export const updateUserFlags = asyncHandler(async (req, res, next) => {
  const { uid, hasSeenFirstTimePaywall, hasUsedFreeLogging } = req.body;

  if (!uid) {
    throw new ApiError(400, "User ID is required");
  }

  const updates = {};
  if (typeof hasSeenFirstTimePaywall === "boolean") {
    updates.hasSeenFirstTimePaywall = hasSeenFirstTimePaywall;
  }
  if (typeof hasUsedFreeLogging === "boolean") {
    updates.hasUsedFreeLogging = hasUsedFreeLogging;
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  const updatedUser = await User.findOneAndUpdate({ uid }, updates, {
    new: true,
  });

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User flags updated successfully"));
});

export const updateUserGoalWeight = asyncHandler(async (req, res, next) => {
  const { uid, weight } = req.body;

  if (!uid) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.goalWeight = Number(weight);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User flags updated successfully"));
});

export const updateUserHeight = asyncHandler(async (req, res, next) => {
  const { uid, height, calories } = req.body;

  if (!uid) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.height = Number(height);
  user.dailyCalorieValue = Number(calories);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User flags updated successfully"));
});

export const updateUserAge = asyncHandler(async (req, res, next) => {
  const { uid, age, calories } = req.body;

  if (!uid) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.age = Number(age);
  user.dailyCalorieValue = Number(calories);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User flags updated successfully"));
});

export const updateUserCalories = asyncHandler(async (req, res, next) => {
  const { uid, calories } = req.body;

  if (!uid) {
    throw new ApiError(400, "User ID is required");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.dailyCalorieValue = Number(calories);

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User flags updated successfully"));
});
