import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Purchase } from './entities/purchase.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Purchase, Product])],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
