import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import type { UserRole } from './user-role.entity';
import type { RolePermission } from './role-permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('UserRole', 'role')
  userRoles: UserRole[];

  @OneToMany('RolePermission', 'role')
  rolePermissions: RolePermission[];
}
