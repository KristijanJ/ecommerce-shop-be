import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

export class PurchaseItemDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsInt()
  @Min(1, { message: 'Quantity must be at least 1.' })
  quantity: number;
}

export class CreatePurchaseDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one item is required.' })
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];
}
