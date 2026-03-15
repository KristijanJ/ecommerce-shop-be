import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseController } from './purchase.controller';
import { PurchaseService } from './purchase.service';
import { mockGuards } from '../common/test/mock-guards';

const mockPurchaseService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

describe('PurchaseController', () => {
  let controller: PurchaseController;

  beforeEach(async () => {
    const module: TestingModule = await mockGuards(
      Test.createTestingModule({
        controllers: [PurchaseController],
        providers: [
          { provide: PurchaseService, useValue: mockPurchaseService },
        ],
      }),
    ).compile();

    controller = module.get<PurchaseController>(PurchaseController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
