import express from "express";
import { registerUser, getUser } from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").get(getUser);

export default router;
