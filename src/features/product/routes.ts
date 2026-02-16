import { Router } from "express";
import { ProductController } from "./controller.js";
import { authenticateToken } from "../../middleware/authToken.js";
import { requirePermissions } from "../../middleware/requirePermission.js";

const router = Router();

router.get("/", ProductController.GetAllProducts);

router.get("/:id", ProductController.GetProductById);

router.post("/", authenticateToken, requirePermissions(["product:create"]), ProductController.CreateProduct);

export default router;
