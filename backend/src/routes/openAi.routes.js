import express from "express";
import {
  fetchExerciseData,
  fetchNutritonFromImage,
  fetchNutritonFromTextDetail,
  updateIngredients,
  updateIngredientsAfterDeletion,
} from "../controllers/openAi.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/imageNutrition")
  .post(upload.single("foodImage"), fetchNutritonFromImage);
router.route("/textNutrition").post(fetchNutritonFromTextDetail);
router.route("/updateIngredient").post(updateIngredients);
router.route("/deletionIngredient").post(updateIngredientsAfterDeletion);
router.route("/exercise").post(fetchExerciseData);

export default router;
