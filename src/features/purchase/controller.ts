import { Request, Response } from "express";
import { PurchaseRepository } from "./repository.js";

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
}
