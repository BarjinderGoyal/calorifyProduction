import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user/user.models.js";
import { ExerciseItem, Exercise } from "../models/Exercise/Exercise.models.js";

export const setExercises = asyncHandler(async (req, res, next) => {
  const { uid, exercises, date } = req.body;

  console.log(uid, exercises, date);

  if (!uid) {
    throw new ApiError(400, "User is missing");
  }
  if (!exercises || !date) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Store all exercise items at once using insertMany
  const exerciseItems = exercises.map((exercise) => ({
    name: exercise.name,
    duration: exercise.duration,
    caloriesBurned: exercise.calories_burned,
  }));
  const insertedExerciseItems = await ExerciseItem.insertMany(exerciseItems);

  // Collect the IDs of the inserted exercise items
  const exerciseItemIds = insertedExerciseItems.map((item) => item._id);

  // Check if an exercise document exists for the user and date
  let exerciseDoc = await Exercise.findOne({ user: user._id, date });

  if (exerciseDoc) {
    // If the exercise document exists, add the new exercise items to it
    exerciseDoc.exercise.push(...exerciseItemIds);
  } else {
    // If the exercise document does not exist, create a new one
    exerciseDoc = new Exercise({
      user: user._id,
      exercise: exerciseItemIds,
      date: date,
    });
  }

  await exerciseDoc.save();

  // Populate the exercise items in the response
  const populatedExerciseDoc = await Exercise.findById(exerciseDoc._id)
    .populate("user", "uid") // Populate user field, with only 'uid' field
    .populate("exercise"); // Populate exercise items

  res
    .status(201)
    .json(
      new ApiResponse(201, populatedExerciseDoc, "Exercise added successfully")
    );
});

export const getExercises = asyncHandler(async (req, res, next) => {
  const { uid, date } = req.query;

  if (!uid) {
    throw new ApiError(400, "User is missing");
  }
  if (!date) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const exercises = await Exercise.findOne({ user: user._id, date }).populate(
    "exercise"
  );

  if (!exercises) {
    // throw new ApiError(404, "No exercises found for the given date");
    res.status(200).json(new ApiResponse(201, null));
  }

  // res.status(200).json({
  //   success: true,
  //   data: exercises,
  // });
  res.status(200).json(new ApiResponse(201, exercises));
});
