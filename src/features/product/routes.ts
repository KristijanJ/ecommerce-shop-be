import { Router } from "express";
import { ProductController } from "./controller.js";
import { authenticateToken } from "../../middleware/authToken.js";

const router = Router();

router.get("/", ProductController.GetAllProducts);
router.post("/", authenticateToken, ProductController.CreateProduct);
router.get("/:id", ProductController.GetProductById);

export default router;
