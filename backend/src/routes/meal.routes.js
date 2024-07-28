import express from "express";
import {
  addNutrition,
  deleteFoodFromMeal,
  getDailyMeals,
  updateFoodInMeal,
  weeklyNutritionDetail,
  fetchFoodFromFoodItemId,
} from "../controllers/meal.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// router.use(upload.single("foodImage"));

router.route("/addMeal").post(addNutrition);
router.route("/getMeal").get(getDailyMeals);
router.route("/deleteMeal").delete(deleteFoodFromMeal);
router.route("/updateMeal").put(updateFoodInMeal);
router.route("/getWeeklyNutritions").get(weeklyNutritionDetail);
router.route("/getSavedFoodDetail").get(fetchFoodFromFoodItemId);
export default router;
