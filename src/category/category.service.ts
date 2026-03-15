import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepo: Repository<ProductCategory>,
  ) {}

  findAll() {
    return this.categoryRepo.find({
      where: { isActive: true },
      select: { id: true, name: true },
    });
  }
}
