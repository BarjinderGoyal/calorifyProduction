import express from "express";
import { registerUser, getUser } from "../controllers/user.controllers.js";
import {
  fetchExerciseData,
  fetchNutritonFromImage,
  fetchNutritonFromTextDetail,
  updateIngredients,
} from "../controllers/openAi.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/imageNutrition")
  .post(upload.single("foodImage"), fetchNutritonFromImage);
router.route("/textNutrition").post(fetchNutritonFromTextDetail);
router.route("/updateIngredient").post(updateIngredients);
router.route("/exercise").post(fetchExerciseData);

export default router;
