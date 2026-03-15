import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { UserRole } from '../../rbac/entities/user-role.entity';
import type { Product } from '../../product/entities/product.entity';
import type { Order } from '../../purchase/entities/order.entity';
import type { Purchase } from '../../purchase/entities/purchase.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('UserRole', 'user')
  userRoles: UserRole[];

  @OneToMany('Product', 'owner')
  products: Product[];

  @OneToMany('Order', 'buyer')
  ordersAsBuyer: Order[];

  @OneToMany('Order', 'seller')
  ordersAsSeller: Order[];

  @OneToMany('Purchase', 'buyer')
  purchases: Purchase[];
}
