import { Router } from "express";
import { AuthController } from "./controller.js";

const router = Router();

router.post("/login", AuthController.Login);
router.post("/register", AuthController.Register);
router.post("/forgot-password", AuthController.ForgotPassword);

export default router;
