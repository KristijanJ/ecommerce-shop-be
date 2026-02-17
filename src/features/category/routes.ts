import { Router } from "express";
import { CategoryController } from "./controller.js";

const router = Router();

router.get("/", CategoryController.GetAllCategories);

export default router;
