import express from "express";
import {
  registerUser,
  getUser,
  updateUserFlags,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(getUser);
router.route("/updateUserFlags").post(updateUserFlags);

export default router;
