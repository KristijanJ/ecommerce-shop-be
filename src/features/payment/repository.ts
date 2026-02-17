import { prisma } from "../../lib/prisma.js";

export class PaymentRepository {
  static async CreatePayment(buyerId: number, purchaseId: number) {
    const purchase = await prisma.purchase.findFirst({
      where: { id: purchaseId },
      select: { id: true, buyerId: true, amount: true, status: true },
    });

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    if (purchase.buyerId !== buyerId) {
      throw new Error("Forbidden.");
    }

    if (purchase.status !== "PENDING") {
      throw new Error(`Purchase is already ${purchase.status.toLowerCase()}.`);
    }

    return await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          purchaseId,
          amount: purchase.amount,
          status: "COMPLETED",
        },
        select: {
          id: true,
          amount: true,
          status: true,
          purchaseId: true,
        },
      });

      await tx.purchase.update({
        where: { id: purchaseId },
        data: { status: "PAID" },
      });

      await tx.order.updateMany({
        where: { purchaseId },
        data: { status: "CONFIRMED" },
      });

      return payment;
    });
  }
}
