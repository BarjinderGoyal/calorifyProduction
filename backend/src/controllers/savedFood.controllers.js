import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { User } from "../models/user/user.models.js";
import { FoodItem } from "../models/Meals/FoodItem.models.js";
import { SavedFood } from "../models/SavedFood/SavedFood.models.js";

export const saveFood = asyncHandler(async (req, res, next) => {
  const { uid, foodId } = req.body;
  console.log("uid is and fofodid", uid, foodId);
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

  // Check if the SavedFood document exists for the user
  let savedFoodDoc = await SavedFood.findOne({ user: user._id });

  if (savedFoodDoc) {
    // If the SavedFood document exists, add the new foodId to the array if it's not already there
    if (!savedFoodDoc.food.includes(foodId)) {
      savedFoodDoc.food.push(foodId);
    }
  } else {
    // If the SavedFood document does not exist, create a new one
    savedFoodDoc = new SavedFood({
      user: user._id,
      food: [foodId],
    });
  }

  await savedFoodDoc.save();

  // Update the isSaved field of the FoodItem
  const foodItem = await FoodItem.findById(foodId);
  if (!foodItem) {
    throw new ApiError(400, "Food item does not exist");
  }
  foodItem.isSaved = true;
  await foodItem.save();

  // Populate the food items in the response
  const populatedSavedFoodDoc = await SavedFood.findById(
    savedFoodDoc._id
  ).populate("food");

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

// Delete Food From SavedFood
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

  // Find the SavedFood document for the user
  const savedFoodDoc = await SavedFood.findOne({ user: user._id });

  if (savedFoodDoc) {
    // Remove the foodId from the array
    savedFoodDoc.food = savedFoodDoc.food.filter(
      (id) => id.toString() !== foodId
    );

    await savedFoodDoc.save();
  }

  // Update the isSaved field of the FoodItem
  const foodItem = await FoodItem.findById(foodId);
  if (!foodItem) {
    throw new ApiError(400, "Food item does not exist");
  }
  foodItem.isSaved = false;
  await foodItem.save();

  const populatedSavedFoodDoc = await SavedFood.findById(
    savedFoodDoc._id
  ).populate("food");

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

// Get Saved Food
export const getSavedFood = asyncHandler(async (req, res, next) => {
  const { uid } = req.query;

  if (!uid) {
    throw new ApiError(400, "Uid is missing");
  }

  const user = await User.findOne({ uid });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Find the SavedFood document for the user and populate the food items
  const savedFoodDoc = await SavedFood.findOne({ user: user._id }).populate(
    "food"
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        savedFoodDoc ? savedFoodDoc.food : [],
        "Saved food retrieved successfully"
      )
    );
});
