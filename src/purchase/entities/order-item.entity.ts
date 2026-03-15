import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Order } from './order.entity';
import type { Product } from '../../product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('Order', 'orderItems')
  order: Order;

  @Column()
  orderId: number;

  @ManyToOne('Product', 'orderItems')
  product: Product;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column()
  priceAtPurchase: number;
}
