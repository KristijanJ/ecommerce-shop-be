import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ProductCategory } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
