import express from "express";
import {
  addWeight,
  getUserWeigths,
} from "../controllers/userWeight.controllers.js";

const router = express.Router();

router.route("/addUserWeight").post(addWeight);
router.route("/getUserWeight").get(getUserWeigths);

export default router;
