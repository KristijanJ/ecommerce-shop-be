import { Router } from "express";
import { ProductController } from "./controller.js";
import { authenticateToken } from "../../middleware/authToken.js";
import { loadPermissions } from "../../middleware/requirePermission.js";

const router = Router();

router.get("/", ProductController.GetAllProducts);

router.get("/mine", authenticateToken, ProductController.GetMyProducts);

router.get("/:id", ProductController.GetProductById);

router.post("/", authenticateToken, loadPermissions, ProductController.CreateProduct);

router.put("/:id", authenticateToken, loadPermissions, ProductController.EditProduct);

router.delete("/:id", authenticateToken, loadPermissions, ProductController.DeleteProduct);

export default router;
