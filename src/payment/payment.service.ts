import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Purchase, PurchaseStatus } from '../purchase/entities/purchase.entity';
import { Order, OrderStatus } from '../purchase/entities/order.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    private readonly dataSource: DataSource,
  ) {}

  async create(purchaseId: number, buyerId: number) {
    const purchase = await this.purchaseRepo.findOne({
      where: { id: purchaseId },
      select: { id: true, buyerId: true, amount: true, status: true },
    });

    if (!purchase) throw new NotFoundException('Purchase not found.');
    if (purchase.buyerId !== buyerId) throw new ForbiddenException();
    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new BadRequestException(`Purchase is already ${purchase.status.toLowerCase()}.`);
    }

    return this.dataSource.transaction(async (tx) => {
      const payment = await tx.getRepository(Payment).save(
        tx.getRepository(Payment).create({
          purchaseId,
          amount: purchase.amount,
          status: PaymentStatus.COMPLETED,
        }),
      );

      await tx.getRepository(Purchase).update(purchaseId, { status: PurchaseStatus.PAID });
      await tx.getRepository(Order).update({ purchaseId }, { status: OrderStatus.CONFIRMED });

      return payment;
    });
  }
}
