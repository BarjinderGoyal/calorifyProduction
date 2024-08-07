import express from "express";
import {
  setExercises,
  getExercises,
} from "../controllers/exercise.controllers.js";

const router = express.Router();

router.route("/addExercises").post(setExercises);
router.route("/getExercises").get(getExercises);

export default router;
