import { Request, Response } from "express";
import { ZodError } from "zod";
import { PaymentRepository } from "./repository.js";
import { CreatePaymentSchema } from "./schemas.js";

export class PaymentController {
  static async CreatePayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const body = CreatePaymentSchema.parse(req.body);
      const payment = await PaymentRepository.CreatePayment(userId, body.purchaseId);

      return res.status(201).json({ data: payment });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      console.log("create payment failed", error);
      return res.status(500).json({});
    }
  }
}
