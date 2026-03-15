import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Purchase } from './entities/purchase.entity';
import { Product } from '../product/entities/product.entity';
import { CreatePurchaseDto, PurchaseItemDto } from './dto/create-purchase.dto';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase) private readonly purchaseRepo: Repository<Purchase>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(buyerId: number) {
    return this.purchaseRepo.find({
      where: { buyerId },
      relations: {
        payments: true,
        orders: { orderItems: { product: true } },
      },
      select: {
        id: true,
        amount: true,
        status: true,
        payments: { id: true, status: true, amount: true },
        orders: {
          id: true,
          status: true,
          orderItems: {
            id: true,
            priceAtPurchase: true,
            quantity: true,
            product: { title: true, image: true },
          },
        },
      },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number, buyerId: number) {
    const purchase = await this.purchaseRepo.findOne({
      where: { id, buyerId },
      relations: { orders: { orderItems: true } },
      select: {
        id: true,
        amount: true,
        status: true,
        orders: {
          id: true,
          status: true,
          orderItems: { id: true, productId: true, quantity: true, priceAtPurchase: true },
        },
      },
    });
    if (!purchase) throw new NotFoundException('Purchase not found.');
    return purchase;
  }

  async create(dto: CreatePurchaseDto, buyerId: number) {
    const productIds = dto.items.map((i) => i.productId);

    const products = await this.productRepo.find({
      where: { id: In(productIds), isActive: true },
      select: { id: true, price: true, stock: true, ownerId: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products were not found or are inactive.');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}.`);
      }
    }

    const itemsBySeller = new Map<number, PurchaseItemDto[]>();
    for (const item of dto.items) {
      const sellerId = productMap.get(item.productId)!.ownerId;
      if (!itemsBySeller.has(sellerId)) itemsBySeller.set(sellerId, []);
      itemsBySeller.get(sellerId)!.push(item);
    }

    const totalAmount = dto.items.reduce((sum, item) => {
      const priceInCents = Math.round(productMap.get(item.productId)!.price * 100);
      return sum + priceInCents * item.quantity;
    }, 0);

    return this.dataSource.transaction(async (tx) => {
      const purchaseRepo = tx.getRepository(Purchase);

      const purchase = await purchaseRepo.save(
        purchaseRepo.create({
          buyerId,
          amount: totalAmount,
          orders: Array.from(itemsBySeller.entries()).map(([sellerId, sellerItems]) => ({
            buyerId,
            sellerId,
            orderItems: sellerItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: Math.round(productMap.get(item.productId)!.price * 100),
            })),
          })),
        }),
      );

      const productRepo = tx.getRepository(Product);
      for (const item of dto.items) {
        await productRepo.decrement({ id: item.productId }, 'stock', item.quantity);
      }

      return purchase;
    });
  }
}
