import {
  IsString,
  IsNumber,
  IsPositive,
  IsUrl,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty.' })
  title: string;

  @IsNumber()
  @IsPositive({ message: 'Price must be a positive number.' })
  price: number;

  @IsString()
  @MinLength(1, { message: 'Description cannot be empty.' })
  description: string;

  @IsUrl({}, { message: 'Image must be a valid URL.' })
  image: string;

  @IsNumber()
  @Min(0, { message: 'Rating must be at least 0.' })
  @Max(5, { message: 'Rating cannot exceed 5.' })
  ratingRate: number = 0;

  @IsInt({ message: 'Rating count must be an integer.' })
  @Min(0, { message: 'Rating count cannot be negative.' })
  ratingCount: number = 0;

  @IsInt({ message: 'Stock must be an integer.' })
  @Min(0, { message: 'Stock cannot be negative.' })
  stock: number = 0;

  @IsInt({ message: 'Category ID must be an integer.' })
  @IsPositive({ message: 'Category ID must be positive.' })
  categoryId: number;
}
