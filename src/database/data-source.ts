import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { ProductCategory } from '../category/entities/category.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Purchase } from '../purchase/entities/purchase.entity';
import { Order } from '../purchase/entities/order.entity';
import { OrderItem } from '../purchase/entities/order-item.entity';
import { Role } from '../rbac/entities/role.entity';
import { Permission } from '../rbac/entities/permission.entity';
import { UserRole } from '../rbac/entities/user-role.entity';
import { RolePermission } from '../rbac/entities/role-permission.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: [
    User, Product, ProductCategory, Payment,
    Purchase, Order, OrderItem,
    Role, Permission, UserRole, RolePermission,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
