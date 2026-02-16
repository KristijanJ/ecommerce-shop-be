import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export class ProductController {
  static async getAllProducts(req: Request, res: Response) {
    // const userId = req.user?.id;
    // console.log("userId", userId);

    const products = await prisma.product.findMany({
      take: 20, // TODO: implement pagination
      include: {
        category: { select: { name: true, id: true } },
      },
    });

    return res.status(200).json({ data: products });
  }

  static async getProductById(req: Request, res: Response) {
    const id = parseInt(req.params.id as string, 10);

    const product = await prisma.product.findFirstOrThrow({
      where: { id },
      include: {
        category: { select: { name: true, id: true } },
      },
    });

    return res.status(200).json({ data: product });
  }
}
