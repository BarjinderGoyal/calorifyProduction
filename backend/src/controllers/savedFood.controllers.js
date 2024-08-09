import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user/user.models.js";
import { FoodItem } from "../models/Meals/FoodItem.models.js";
import { SavedFood } from "../models/SavedFood/SavedFood.models.js";

export const saveFood = asyncHandler(async (req, res, next) => {
  const { uid, foodId } = req.body;

  if (!uid) {
    throw new ApiError(400, "Uid is missing");
  }
  if (!foodId) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  let savedFoodDoc = await SavedFood.findOne({ user: user._id });

  if (savedFoodDoc) {
    if (!savedFoodDoc.food.includes(foodId)) {
      savedFoodDoc.food.push(foodId);
    }
  } else {
    savedFoodDoc = new SavedFood({
      user: user._id,
      food: [foodId],
    });
  }

  await savedFoodDoc.save();

  const foodItem = await FoodItem.findById(foodId);
  if (!foodItem) {
    throw new ApiError(400, "Food item does not exist");
  }
  foodItem.isSaved = true;
  await foodItem.save();

  const populatedSavedFoodDoc = await SavedFood.findById(
    savedFoodDoc._id
  ).populate({
    path: "food",
    populate: {
      path: "items",
      model: "Item", // Adjust based on your model name
    },
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedSavedFoodDoc,
        "Food added to saved list successfully"
      )
    );
});

export const deleteFoodFromSavedFood = asyncHandler(async (req, res, next) => {
  const { uid, foodId } = req.body;
  if (!uid) {
    throw new ApiError(400, "Uid is missing");
  }
  if (!foodId) {
    throw new ApiError(400, "Missing required fields");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const savedFoodDoc = await SavedFood.findOne({ user: user._id });

  if (savedFoodDoc) {
    savedFoodDoc.food = savedFoodDoc.food.filter(
      (id) => id.toString() !== foodId
    );

    await savedFoodDoc.save();
  }

  const foodItem = await FoodItem.findById(foodId);
  if (!foodItem) {
    throw new ApiError(400, "Food item does not exist");
  }
  foodItem.isSaved = false;
  await foodItem.save();

  const populatedSavedFoodDoc = await SavedFood.findById(
    savedFoodDoc._id
  ).populate({
    path: "food",
    populate: {
      path: "items",
      model: "Item", // Adjust based on your model name
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        populatedSavedFoodDoc,
        "Food removed from saved list successfully"
      )
    );
});

export const getSavedFood = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;

  if (!uid) {
    throw new ApiError(400, "Uid is missing");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const savedFoodDoc = await SavedFood.findOne({ user: user._id }).populate({
    path: "food",
    populate: {
      path: "items",
      model: "Item", // Adjust based on your model name
    },
  });
  res.status(200).json(
    new ApiResponse(
      200,
      savedFoodDoc, // savedFoodDoc ? savedFoodDoc.food : [],
      "Saved food retrieved successfully"
    )
  );
});
