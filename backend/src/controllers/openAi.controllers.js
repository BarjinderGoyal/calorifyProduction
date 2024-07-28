import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  imageToNutritions,
  textToNutritions,
  updateIngredient,
  textToExercise,
} from "../Prompts.js";
import axios from "axios";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const url = "https://api.openai.com/v1/chat/completions";
const model = process.env.OPENAI_MODEL;

export const fetchNutritonFromImage = asyncHandler(async (req, res, next) => {
  // const { imageUri } = req.body;
  let imageUrl = "";
  console.log("MULTER UPLOADED FILE PATH IS", req.file);
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
  console.log(nutritionInfo);

  if (!nutritionInfo || nutritionInfo.includes("error")) {
    // Delete the image from Cloudinary if the response is incorrect
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
    console.log(" foodfeatil is => ", foodDetails);

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

    console.log(jsonResponse, " this the response received from oepai");

    const nutritionInfo = jsonResponse.choices[0].message.content;
    console.log(nutritionInfo);

    res
      .status(200)
      .json(
        new ApiResponse(200, nutritionInfo, "Nutrition received successfully")
      );
  }
);

export const updateIngredients = asyncHandler(async (req, res, next) => {
  // updateIngredient;
  const { originalResponse, additionalIngredients } = req.body;
  console.log(
    "orinial response",
    originalResponse,
    "additionalIngedrient",
    additionalIngredients
  );

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

  console.log(
    jsonResponse,
    " this the updated nutrition response received from oepai"
  );

  const nutritionInfo = jsonResponse.choices[0].message.content;
  console.log(nutritionInfo);

  res
    .status(200)
    .json(
      new ApiResponse(200, nutritionInfo, "Nutrition updated successfully")
    );
});

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
  console.log(nutritionInfo);

  res
    .status(200)
    .json(
      new ApiResponse(200, nutritionInfo, "Exercise received successfully")
    );
});
