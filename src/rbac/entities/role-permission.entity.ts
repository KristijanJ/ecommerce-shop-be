import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import type { Role } from './role.entity';
import type { Permission } from './permission.entity';

@Entity()
export class RolePermission {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  permissionId: number;

  @ManyToOne('Role', 'rolePermissions')
  role: Role;

  @ManyToOne('Permission', 'rolePermissions')
  permission: Permission;
}
