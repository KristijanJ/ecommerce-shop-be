import { Test, TestingModule } from '@nestjs/testing';
import { RbacController } from './rbac.controller';
import { mockGuards } from '../common/test/mock-guards';

describe('RbacController', () => {
  let controller: RbacController;

  beforeEach(async () => {
    const module: TestingModule = await mockGuards(
      Test.createTestingModule({
        controllers: [RbacController],
      }),
    ).compile();

    controller = module.get<RbacController>(RbacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
