import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { mockGuards } from '../common/test/mock-guards';

const mockCategoryService = {
  findAll: jest.fn(),
};

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await mockGuards(
      Test.createTestingModule({
        controllers: [CategoryController],
        providers: [
          { provide: CategoryService, useValue: mockCategoryService },
        ],
      }),
    ).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
