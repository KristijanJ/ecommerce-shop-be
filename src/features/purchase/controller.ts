import { Request, Response } from "express";
import { ZodError } from "zod";
import { PurchaseRepository } from "./repository.js";
import { CreatePurchaseSchema } from "./schemas.js";

export class PurchaseController {
  static async GetAllPurchasesForBuyer(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const purchases = PurchaseRepository.FetchPurchasesForBuyer(userId);
      return res.status(200).json({ data: purchases });
    } catch (error) {
      console.log("get all products failed", error);
      return res.status(500).json({});
    }
  }

  static async MakeNewPurchase(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const body = CreatePurchaseSchema.parse(req.body);
      const purchase = await PurchaseRepository.CreatePurchase(userId, body.items);

      return res.status(201).json({ data: purchase });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      console.log("make new purchase failed", error);
      return res.status(500).json({});
    }
  }
}
