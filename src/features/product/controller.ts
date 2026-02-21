import { Request, Response } from "express";
import { ProductRepository } from "./repository.js";
import { IProduct, ProductSchema } from "./schemas.js";
import { ZodError } from "zod";
import { RBAC } from "../rbac/service.js";

export class ProductController {
  static async GetAllProducts(req: Request, res: Response) {
    try {
      const categoryId = req.query.category ? parseInt(req.query.category as string, 10) : undefined;
      const search = req.query.search as string | undefined;

      const products = await ProductRepository.FetchProducts({
        categoryId: categoryId && !isNaN(categoryId) ? categoryId : undefined,
        search,
      });

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

  static async GetMyProducts(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const products = await ProductRepository.FetchProductsByOwner(userId);
      return res.status(200).json({ data: products });
    } catch (error) {
      console.log("get my products failed", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
  }

  static async CreateProduct(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userPermissions = req.userPermissions || [];

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const canCreate = userPermissions.includes("product:create");

      if (!canCreate) {
        return res.status(403).json({ error: "Forbidden: Missing product:create permission" });
      }

      const newProduct = ProductSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      const product = await ProductRepository.SaveProduct(newProduct);

      return res.status(201).json({ data: product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async EditProduct(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userPermissions = req.userPermissions || [];

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id as string, 10);
      const existingProduct = await ProductRepository.FetchProductById(id);

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const canEdit = RBAC.CanPerformAction(userPermissions, userId, existingProduct.owner.id, [
        "product:update:own",
        "product:update:any",
      ]);

      if (!canEdit) {
        return res.status(403).json({ error: "Forbidden: You can only edit your own products" });
      }

      // Parse and validate, then add id (Zod strips fields not in schema)
      const parsedData = ProductSchema.parse({
        title: req.body.title ?? existingProduct.title,
        price: req.body.price ?? existingProduct.price,
        description: req.body.description ?? existingProduct.description,
        image: req.body.image ?? existingProduct.image,
        ratingRate: req.body.ratingRate ?? existingProduct.ratingRate,
        ratingCount: req.body.ratingCount ?? existingProduct.ratingCount,
        stock: req.body.stock ?? existingProduct.stock,
        ownerId: existingProduct.owner.id,
        productCategoryId: req.body.productCategoryId ?? existingProduct.category.id,
      });

      const updatedProduct: IProduct = {
        ...parsedData,
        id, // Add id after parsing
      };

      const product = await ProductRepository.SaveProduct(updatedProduct);

      return res.status(200).json({ data: product });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: JSON.parse(error.message) });
      }
      console.log("edit product failed", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }

  static async DeleteProduct(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userPermissions = req.userPermissions || [];

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const id = parseInt(req.params.id as string, 10);
      const existingProduct = await ProductRepository.FetchProductById(id);

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const canDelete = RBAC.CanPerformAction(userPermissions, userId, existingProduct.owner.id, [
        "product:delete:own",
        "product:delete:any",
      ]);

      if (!canDelete) {
        return res.status(403).json({ error: "Forbidden: You can only delete your own products" });
      }

      await ProductRepository.SoftDeleteProduct(id);
      return res.status(204).send();
    } catch (error) {
      console.log("delete product failed", error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
}
