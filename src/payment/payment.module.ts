import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Purchase } from '../purchase/entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Purchase])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
