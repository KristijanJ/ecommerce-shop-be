import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import type { Role } from './role.entity';

@Entity()
export class UserRole {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne('User', 'userRoles')
  user: User;

  @ManyToOne('Role', 'userRoles')
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
