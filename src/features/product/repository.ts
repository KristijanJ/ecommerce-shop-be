import { prisma } from "../../lib/prisma.js";
import { IProduct, IProductDto } from "./schemas.js";

export class ProductRepository {
  static async FetchProducts(): Promise<IProductDto[]> {
    try {
      const productsResponse = await prisma.product.findMany({
        take: 20, // TODO: implement pagination
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          image: true,
          ratingRate: true,
          ratingCount: true,
          productCategoryId: false,
          ownerId: false,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });

      return productsResponse;
    } catch (error) {
      throw error;
    }
  }

  static async FetchProductById(id: number): Promise<IProductDto | null> {
    try {
      const product = await prisma.product.findFirst({
        where: { id },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          image: true,
          ratingRate: true,
          ratingCount: true,
          productCategoryId: false,
          ownerId: false,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });

      return product;
    } catch (error) {
      throw error;
    }
  }

  static async FetchProductsByOwner(ownerId: number): Promise<IProductDto[]> {
    try {
      return await prisma.product.findMany({
        where: { ownerId },
        select: {
          id: true,
          title: true,
          price: true,
          description: true,
          image: true,
          ratingRate: true,
          ratingCount: true,
          productCategoryId: false,
          ownerId: false,
          category: {
            select: { id: true, name: true },
          },
          owner: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async SaveProduct(newProduct: IProduct): Promise<IProduct | null> {
    try {
      let product;

      if (newProduct.id) {
        product = await prisma.product.update({
          where: { id: newProduct.id },
          data: newProduct,
        });
      } else {
        product = await prisma.product.create({
          data: newProduct,
        });
      }

      return product;
    } catch (error) {
      throw error;
    }
  }
}
