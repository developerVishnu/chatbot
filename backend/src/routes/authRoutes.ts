import { Router } from "express";
import { login, signUp } from "../controllers/authControllers.js";

const router = Router();

router.get("/", login);

router.get("/signUp", signUp);

export default router;
