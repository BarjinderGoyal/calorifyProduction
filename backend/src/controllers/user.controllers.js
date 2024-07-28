import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user/user.models.js";
import { UserWeight } from "../models/Weight/UserWeight.models.js";
import { WeightLog } from "../models/Weight/WeightLog.models.js";
import { format } from "date-fns";

// export const registerUser = asyncHandler(async (req, res, next) => {
//   const {
//     uid,
//     userName,
//     email,
//     age,
//     gender,
//     height,
//     weight,
//     goal,
//     activityLevel,
//     weeklyGoal,
//     goalWeight,
//     dailyCalorieValue,
//   } = req.body;
//   if (
//     [uid, userName, email, goal, gender].some((field) => field.trim() === "")
//   ) {
//     throw new ApiError(400, "All field are required");
//   }
//   if (
//     [
//       age,
//       height,
//       weight,
//       dailyCalorieValue,
//       activityLevel,
//       weeklyGoal,
//       goalWeight,
//     ].some((field) => field === 0)
//   ) {
//     throw new ApiError(400, "All field are required");
//   }

//   const existedUser = await User.findOne({ $or: [{ uid }, { email }] });

//   if (existedUser) {
//     throw new ApiError(409, "User is already existed");
//   }

//   const user = await User.create({
//     uid,
//     userName,
//     email,
//     age,
//     gender,
//     height,
//     weight,
//     goal,
//     activityLevel,
//     weeklyGoal,
//     goalWeight,
//     dailyCalorieValue,
//   });

//   const createdUser = await User.findById(user._id);

//   if (!createdUser) {
//     throw new ApiError(500, "Something went wrong while creating account");
//   }

//   return res
//     .status(201)
//     .json(new ApiResponse(201, user, "user registed Successfully"));
// });

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
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the account");
  }

  // Add user's initial weight to the WeightLog collection
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd"); // Format date as needed
  const weightLog = await WeightLog.create({
    date: formattedDate,
    weight: weight,
  });

  // Associate weight log entry with the user in the UserWeight collection
  await UserWeight.create({
    user: user._id,
    weights: [weightLog._id],
  });

  return res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

// Get User Function
export const getUser = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;
  console.log(uid);
  if (!uid || uid === "") {
    throw new ApiError(400, "User is required");
  }

  const user = await User.findOne({ uid });

  console.log("USER IS", user);

  if (!user) {
    // throw new ApiError(500, "Something went wrong while login ");
    return res
      .status(201)
      .json(new ApiResponse(201, null, "user login Successfully"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, user, "user login Successfully"));
});
