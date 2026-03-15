import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { RolePermission } from './role-permission.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany('RolePermission', 'permission')
  rolePermissions: RolePermission[];
}
