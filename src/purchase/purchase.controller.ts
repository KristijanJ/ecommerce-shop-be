import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';

@Controller('purchases')
@UseGuards(JwtAuthGuard)
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.purchaseService.findAll(user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.purchaseService.findOne(id, user.id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreatePurchaseDto, @CurrentUser() user: JwtPayload) {
    return this.purchaseService.create(dto, user.id);
  }
}
