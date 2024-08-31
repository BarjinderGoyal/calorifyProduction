import express from "express";
import {
  registerUser,
  getUser,
  updateUserFlags,
  updateUserGoalWeight,
  updateUserHeight,
  updateUserCalories,
  updateUserAge,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(getUser);
router.route("/updateUserFlags").post(updateUserFlags);
router.route("/updateTargetWeight").post(updateUserGoalWeight);
router.route("/updateHeight").post(updateUserHeight);
router.route("/updateAge").post(updateUserAge);
router.route("/updateCalories").post(updateUserCalories);

export default router;
