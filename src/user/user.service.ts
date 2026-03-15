import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRole } from '../rbac/entities/user-role.entity';
import { Role } from '../rbac/entities/role.entity';

export interface IUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  roles: string[];
}

interface IGetUser {
  id?: number;
  email?: string;
  withPassword?: boolean;
}

interface ICreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async getUser({ id, email, withPassword = false }: IGetUser): Promise<IUserDto | null> {
    const where = id ? { id, isActive: true } : email ? { email, isActive: true } : null;
    if (!where) return null;

    const user = await this.userRepo.findOne({
      where,
      relations: { userRoles: { role: true } },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: withPassword ? user.password : undefined,
      roles: user.userRoles.map((ur) => ur.role.name),
    };
  }

  async createUser(newUser: ICreateUser): Promise<IUserDto> {
    const existing = await this.getUser({ email: newUser.email });
    if (existing) throw new Error('user_with_email_exists');

    const { role, ...userData } = newUser;

    const user = await this.userRepo.save(this.userRepo.create(userData));

    const roleRecord = await this.roleRepo.findOne({
      where: { name: role, isActive: true },
    });

    if (roleRecord) {
      await this.userRoleRepo.save(
        this.userRoleRepo.create({ userId: user.id, roleId: roleRecord.id }),
      );
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: role ? [role] : [],
    };
  }
}
