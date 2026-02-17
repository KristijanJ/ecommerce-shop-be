import { prisma } from "../../lib/prisma.js";

export class PurchaseRepository {
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
