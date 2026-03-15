import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { mockGuards } from '../common/test/mock-guards';

const mockPaymentService = { create: jest.fn() };

describe('PaymentController', () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await mockGuards(
      Test.createTestingModule({
        controllers: [PaymentController],
        providers: [{ provide: PaymentService, useValue: mockPaymentService }],
      }),
    ).compile();

    controller = module.get<PaymentController>(PaymentController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
