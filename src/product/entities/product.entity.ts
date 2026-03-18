import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ProductCategory } from '../../category/entities/category.entity';
import type { User } from '../../user/entities/user.entity';
import type { OrderItem } from '../../purchase/entities/order-item.entity';

@Entity()
@Index(['ownerId', 'categoryId'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('float')
  price: number;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column('float')
  ratingRate: number;

  @Column()
  ratingCount: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne('ProductCategory', 'products')
  category: ProductCategory;

  @Index()
  @Column()
  categoryId: number;

  @ManyToOne('User', 'products')
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany('OrderItem', 'product')
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
