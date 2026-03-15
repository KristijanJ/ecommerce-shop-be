import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async fetchPermissionsForRoles(roleNames: string[]): Promise<string[]> {
    const roles = await this.roleRepo.find({
      where: { name: In(roleNames), isActive: true },
      relations: { rolePermissions: { permission: true } },
    });

    return roles.flatMap((role) =>
      role.rolePermissions.map((rp) => rp.permission.name),
    );
  }

  canPerformAction(
    userPermissions: string[],
    userId: number,
    resourceOwnerId: number,
    requiredPermissions: string[],
  ): boolean {
    const anyPerms = requiredPermissions.filter((p) => p.endsWith(':any'));
    if (userPermissions.some((p) => anyPerms.includes(p))) return true;

    const ownPerms = requiredPermissions.filter((p) => p.endsWith(':own'));
    if (userPermissions.some((p) => ownPerms.includes(p)) && userId === resourceOwnerId) return true;

    const genericPerms = requiredPermissions.filter(
      (p) => !p.endsWith(':own') && !p.endsWith(':any'),
    );
    if (userPermissions.some((p) => genericPerms.includes(p))) return true;

    return false;
  }
}
