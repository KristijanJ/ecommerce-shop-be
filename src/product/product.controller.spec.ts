import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { mockGuards } from '../common/test/mock-guards';

const mockProducts = [
  { id: 1, title: 'Product A', price: 10 },
  { id: 2, title: 'Product B', price: 20 },
];

const mockProductService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findMine: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await mockGuards(
      Test.createTestingModule({
        controllers: [ProductController],
        providers: [{ provide: ProductService, useValue: mockProductService }],
      }),
    ).compile();

    controller = module.get<ProductController>(ProductController);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns all products when no filters provided', async () => {
      mockProductService.findAll.mockResolvedValue(mockProducts);

      const result = await controller.findAll();

      expect(mockProductService.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockProducts);
    });

    it('passes categoryId and search to service', async () => {
      mockProductService.findAll.mockResolvedValue([mockProducts[0]]);

      await controller.findAll('1', 'Product A');

      expect(mockProductService.findAll).toHaveBeenCalledWith(1, 'Product A');
    });

    it('ignores non-numeric category query param', async () => {
      mockProductService.findAll.mockResolvedValue(mockProducts);

      await controller.findAll('abc');

      expect(mockProductService.findAll).toHaveBeenCalledWith(undefined, undefined);
    });
  });
});
