import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Product } from '../../product/entities/product.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('Product', 'category')
  products: Product[];
}
