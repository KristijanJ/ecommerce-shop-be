import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: HealthCheckService, useValue: { check: jest.fn() } },
        { provide: TypeOrmHealthIndicator, useValue: { pingCheck: jest.fn() } },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
