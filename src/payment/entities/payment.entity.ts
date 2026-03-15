import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Purchase } from '../../purchase/entities/purchase.entity';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Column()
  amount: number;

  @ManyToOne('Purchase', 'payments')
  purchase: Purchase;

  @Column()
  purchaseId: number;
}
