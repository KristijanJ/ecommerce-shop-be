import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserRole } from '../rbac/entities/user-role.entity';
import { Role } from '../rbac/entities/role.entity';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn(), save: jest.fn(), create: jest.fn() },
        },
        {
          provide: getRepositoryToken(UserRole),
          useValue: { save: jest.fn(), create: jest.fn() },
        },
        { provide: getRepositoryToken(Role), useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
