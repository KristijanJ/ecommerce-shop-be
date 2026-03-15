import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import type { Order } from './order.entity';
import type { Payment } from '../../payment/entities/payment.entity';

export enum PurchaseStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('User', 'purchases')
  buyer: User;

  @Column()
  buyerId: number;

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PurchaseStatus,
    default: PurchaseStatus.PENDING,
  })
  status: PurchaseStatus;

  @OneToMany('Order', 'purchase')
  orders: Order[];

  @OneToMany('Payment', 'purchase')
  payments: Payment[];
}
