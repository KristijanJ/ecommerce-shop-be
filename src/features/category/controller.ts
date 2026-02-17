import { Request, Response } from "express";
import { CategoryRepository } from "./repository.js";

export class CategoryController {
  static async GetAllCategories(_req: Request, res: Response) {
    try {
      const categories = await CategoryRepository.FetchCategories();
      return res.status(200).json({ data: categories });
    } catch {
      return res.status(500).json({ error: "Failed to fetch categories" });
    }
  }
}
