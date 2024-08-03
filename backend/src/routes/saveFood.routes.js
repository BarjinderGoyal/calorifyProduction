import express from "express";
import {
  saveFood,
  getSavedFood,
  deleteFoodFromSavedFood,
} from "../controllers/savedFood.controllers.js";

const router = express.Router();

router.route("/saveFood").post(saveFood);
router.route("/deleteSavedFood").post(deleteFoodFromSavedFood);
router.route("/getSavedFood").get(getSavedFood);

export default router;
