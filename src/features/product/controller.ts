import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { ProductRepository } from "./repository.js";
import { ProductSchema } from "./schemas.js";
import { ZodError } from "zod";

export class ProductController {
  static async GetAllProducts(req: Request, res: Response) {
    try {
      const products = await ProductRepository.FetchProducts();

      return res.status(200).json({ data: products });
    } catch (error) {
      console.log("get all products failed", error);
      return res.status(500).json({});
    }
  }

  static async GetProductById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      const product = await ProductRepository.FetchProductById(id);

      if (!product) {
        return res.status(404).json({ data: null });
      }

      return res.status(200).json({ data: product });
    } catch (error) {
      console.log("get product by id failed", error);
      return res.status(500).json({});
    }
  }

  static async CreateProduct(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const newProduct = ProductSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      const product = await ProductRepository.SaveProduct(newProduct);

      return res.status(200).json({ data: product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      return res.status(500).json({ error: "something went wrong" });
    }
  }
}
