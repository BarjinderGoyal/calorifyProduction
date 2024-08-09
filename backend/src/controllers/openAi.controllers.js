import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  imageToNutritions,
  textToNutritions,
  updateIngredient,
  textToExercise,
  updateIngredientAfterDeletion,
} from "../Prompts.js";
import axios from "axios";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const url = "https://api.openai.com/v1/chat/completions";
const model = process.env.OPENAI_MODEL;

export const fetchNutritonFromImage = asyncHandler(async (req, res, next) => {
  let imageUrl = "";
  if (req.file) {
    imageUrl = await uploadOnCloudinary(req.file.buffer);
  }
  if (imageUrl === "" || !imageUrl) {
    throw new ApiError(404, "Image not found");
  }

  const params = imageToNutritions(model, imageUrl);

  const response = await axios.post(url, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    },
  });

  const jsonResponse = response.data;

  const nutritionInfo = jsonResponse.choices[0].message.content;

  if (!nutritionInfo || nutritionInfo.includes("error")) {
    await cloudinary.uploader.destroy(imageUrl);
    throw new ApiError(400, "Invalid image");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { nutritionInfo, foodImage: imageUrl },
        "Nutrition received successfully"
      )
    );
});

export const fetchNutritonFromTextDetail = asyncHandler(
  async (req, res, next) => {
    const { foodDetails } = req.body;

    if (!foodDetails) {
      throw new Error(404, "Food description not found");
    }

    const params = textToNutritions(model, foodDetails);

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
      },
    });

    const jsonResponse = response.data;

    const nutritionInfo = jsonResponse.choices[0].message.content;

    res
      .status(200)
      .json(
        new ApiResponse(200, nutritionInfo, "Nutrition received successfully")
      );
  }
);

export const updateIngredients = asyncHandler(async (req, res, next) => {
  const { originalResponse, additionalIngredients } = req.body;

  if (!originalResponse || !additionalIngredients) {
    throw new ApiError("Values is missing");
  }
  const params = updateIngredient(
    model,
    originalResponse,
    additionalIngredients
  );

  const response = await axios.post(url, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    },
  });

  const jsonResponse = response.data;

  const nutritionInfo = jsonResponse.choices[0].message.content;
  res
    .status(200)
    .json(
      new ApiResponse(200, nutritionInfo, "Nutrition updated successfully")
    );
});

export const updateIngredientsAfterDeletion = asyncHandler(
  async (req, res, next) => {
    const { updatedFoodItem } = req.body;

    if (!updatedFoodItem) {
      throw new ApiError("Updated food item is missing");
    }

    const params = updateIngredientAfterDeletion(model, updatedFoodItem);

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
      },
    });

    const jsonResponse = response.data;

    const nutritionInfo = jsonResponse.choices[0].message.content;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          nutritionInfo,
          "Nutrition updated successfully after deletion"
        )
      );
  }
);

export const fetchExerciseData = asyncHandler(async (req, res, next) => {
  const { exerciseDetails } = req.body;

  if (!exerciseDetails) {
    throw new Error(404, "Food description not found");
  }

  const params = textToExercise(model, exerciseDetails);

  const response = await axios.post(url, params, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    },
  });

  const jsonResponse = response.data;

  const nutritionInfo = jsonResponse.choices[0].message.content;

  res
    .status(200)
    .json(
      new ApiResponse(200, nutritionInfo, "Exercise received successfully")
    );
});
