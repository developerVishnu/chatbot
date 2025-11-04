import { Router } from "express";
import { login, signUp } from "../controllers/authControllers.js";

const router = Router();

router.route("/login").post(login);
router.route("/signUp").post(signUp);

export default router;
