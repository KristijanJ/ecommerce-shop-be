import { Router } from "express";
import { PaymentController } from "./controller.js";
import { authenticateToken } from "../../middleware/authToken.js";
import { loadPermissions } from "../../middleware/requirePermission.js";

const router = Router();

router.post("/", authenticateToken, loadPermissions, PaymentController.CreatePayment);

export default router;
