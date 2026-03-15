import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: JwtPayload) {
    return this.paymentService.create(dto.purchaseId, user.id);
  }
}
