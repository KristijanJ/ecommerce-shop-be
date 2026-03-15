import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { RbacService } from '../rbac.service';
import { JwtPayload } from '../../auth/strategies/jwt.strategy';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );

    if (!required || required.length === 0) return true;

    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user?.roles) throw new ForbiddenException();

    const userPermissions = await this.rbacService.fetchPermissionsForRoles(user.roles);
    request.userPermissions = userPermissions;

    const resourceOwnerId: number | undefined = request.resourceOwnerId;

    const canAct = this.rbacService.canPerformAction(
      userPermissions,
      user.id,
      resourceOwnerId ?? user.id,
      required,
    );

    if (!canAct) throw new ForbiddenException();

    return true;
  }
}
