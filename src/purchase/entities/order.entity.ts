import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import type { Purchase } from './purchase.entity';
import type { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'ordersAsBuyer')
  buyer: User;

  @Column()
  buyerId: number;

  @ManyToOne('User', 'ordersAsSeller')
  seller: User;

  @Column()
  sellerId: number;

  @ManyToOne('Purchase', 'orders')
  purchase: Purchase;

  @Column({ nullable: true })
  purchaseId: number;

  @OneToMany('OrderItem', 'order', { cascade: true })
  orderItems: OrderItem[];

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
