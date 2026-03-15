import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserRole } from '../rbac/entities/user-role.entity';
import { Role } from '../rbac/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole, Role])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
