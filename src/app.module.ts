import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { PurchaseModule } from './purchase/purchase.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RbacModule } from './rbac/rbac.module';
import { User } from './user/entities/user.entity';
import { Product } from './product/entities/product.entity';
import { ProductCategory } from './category/entities/category.entity';
import { Payment } from './payment/entities/payment.entity';
import { Purchase } from './purchase/entities/purchase.entity';
import { Order } from './purchase/entities/order.entity';
import { OrderItem } from './purchase/entities/order-item.entity';
import { Role } from './rbac/entities/role.entity';
import { Permission } from './rbac/entities/permission.entity';
import { UserRole } from './rbac/entities/user-role.entity';
import { RolePermission } from './rbac/entities/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE,
      synchronize: false,
      entities: [
        User,
        Product,
        ProductCategory,
        Payment,
        Purchase,
        Order,
        OrderItem,
        Role,
        Permission,
        UserRole,
        RolePermission,
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp:
        process.env.NODE_ENV !== 'production'
          ? {
              customSuccessMessage: (req, res) =>
                `${req.method} ${req.url} → ${res.statusCode}`,
              customErrorMessage: (req, res) =>
                `${req.method} ${req.url} → ${res.statusCode}`,
              customLogLevel: (_req, res) => {
                if (res.statusCode >= 500) return 'silent';
                if (res.statusCode >= 400) return 'warn';
                return 'info';
              },
              serializers: {
                req: () => undefined,
                res: () => undefined,
              },
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:HH:MM:ss.l',
                  ignore: 'pid,hostname,req,res',
                },
              },
            }
          : {},
    }),
    ProductModule,
    CategoryModule,
    PaymentModule,
    PurchaseModule,
    UserModule,
    AuthModule,
    RbacModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
