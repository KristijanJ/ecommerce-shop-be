import { prisma } from "../../lib/prisma.js";
import { ICreatePurchaseItem } from "./schemas.js";

export class PurchaseRepository {
  static async CreatePurchase(buyerId: number, items: ICreatePurchaseItem[]) {
    const productIds = items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, price: true, stock: true, ownerId: true },
    });

    if (products.length !== productIds.length) {
      throw new Error("One or more products were not found or are inactive.");
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}.`);
      }
    }

    // Group items by seller — one Order per seller
    const itemsBySeller = new Map<number, ICreatePurchaseItem[]>();
    for (const item of items) {
      const sellerId = productMap.get(item.productId)!.ownerId;
      if (!itemsBySeller.has(sellerId)) itemsBySeller.set(sellerId, []);
      itemsBySeller.get(sellerId)!.push(item);
    }

    // Total amount in cents
    const totalAmount = items.reduce((sum, item) => {
      const priceInCents = Math.round(productMap.get(item.productId)!.price * 100);
      return sum + priceInCents * item.quantity;
    }, 0);

    return await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          buyerId,
          amount: totalAmount,
          orders: {
            create: Array.from(itemsBySeller.entries()).map(([sellerId, sellerItems]) => ({
              buyerId,
              sellerId,
              orderItems: {
                create: sellerItems.map((item) => ({
                  productId: item.productId,
                  quantity: item.quantity,
                  priceAtPurchase: Math.round(productMap.get(item.productId)!.price * 100),
                })),
              },
            })),
          },
        },
        select: {
          id: true,
          amount: true,
          status: true,
          orders: {
            select: {
              id: true,
              status: true,
              sellerId: true,
              orderItems: {
                select: {
                  id: true,
                  productId: true,
                  quantity: true,
                  priceAtPurchase: true,
                },
              },
            },
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return purchase;
    });
  }

  static async FetchPurchasesForBuyer(buyerId: number) {
    try {
      const purchases = await prisma.purchase.findMany({
        where: { buyerId },
        select: {
          id: true,
          amount: true,
          orders: {
            select: {
              id: true,
              status: true,
              orderItems: {
                select: {
                  id: true,
                  priceAtPurchase: true,
                  quantity: true,
                },
              },
            },
          },
        },
      });
      return purchases;
    } catch (error) {
      throw error;
    }
  }
}
