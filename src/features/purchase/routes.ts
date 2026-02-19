import { Router } from "express";
import { PurchaseController } from "./controller.js";
import { authenticateToken } from "../../middleware/authToken.js";
import { loadPermissions } from "../../middleware/requirePermission.js";

const router = Router();

router.get("/", authenticateToken, loadPermissions, PurchaseController.GetAllPurchasesForBuyer);
router.get("/:id", authenticateToken, loadPermissions, PurchaseController.GetPurchaseById);

router.post("/", authenticateToken, loadPermissions, PurchaseController.MakeNewPurchase);

export default router;
