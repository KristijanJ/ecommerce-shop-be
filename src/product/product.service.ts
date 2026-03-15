import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RbacService } from '../rbac/rbac.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly rbacService: RbacService,
  ) {}

  findAll(categoryId?: number, search?: string) {
    return this.productRepo.find({
      take: 20,
      where: {
        isActive: true,
        ...(categoryId ? { categoryId: categoryId } : {}),
        ...(search ? { title: ILike(`%${search}%`) } : {}),
      },
      relations: { category: true, owner: true },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        ratingRate: true,
        ratingCount: true,
        stock: true,
        category: { id: true, name: true },
        owner: { id: true, email: true, firstName: true, lastName: true },
      },
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id, isActive: true },
      relations: { category: true, owner: true },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        ratingRate: true,
        ratingCount: true,
        stock: true,
        category: { id: true, name: true },
        owner: { id: true, email: true, firstName: true, lastName: true },
      },
    });
    if (!product) throw new NotFoundException();
    return product;
  }

  findMine(ownerId: number) {
    return this.productRepo.find({
      where: { ownerId, isActive: true },
      relations: { category: true, owner: true },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        image: true,
        ratingRate: true,
        ratingCount: true,
        stock: true,
        category: { id: true, name: true },
        owner: { id: true, email: true, firstName: true, lastName: true },
      },
    });
  }

  async create(dto: CreateProductDto, ownerId: number) {
    const product = this.productRepo.create({ ...dto, ownerId });
    return this.productRepo.save(product);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    userId: number,
    userRoles: string[],
  ) {
    const product = await this.productRepo.findOne({
      where: { id, isActive: true },
      relations: { owner: true },
    });
    if (!product) throw new NotFoundException();

    const permissions =
      await this.rbacService.fetchPermissionsForRoles(userRoles);
    const canEdit = this.rbacService.canPerformAction(
      permissions,
      userId,
      product.owner.id,
      ['product:update:own', 'product:update:any'],
    );
    if (!canEdit) throw new ForbiddenException();

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number, userId: number, userRoles: string[]) {
    const product = await this.productRepo.findOne({
      where: { id, isActive: true },
      relations: { owner: true },
    });
    if (!product) throw new NotFoundException();

    const permissions =
      await this.rbacService.fetchPermissionsForRoles(userRoles);
    const canDelete = this.rbacService.canPerformAction(
      permissions,
      userId,
      product.owner.id,
      ['product:delete:own', 'product:delete:any'],
    );
    if (!canDelete) throw new ForbiddenException();

    await this.productRepo.update(id, { isActive: false });
  }
}
