import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../strategies/jwt.strategy';

export interface CurrentUserGetRequest {
  user: JwtPayload;
  userPermissions?: string[];
  resourceOwnerId?: number;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<CurrentUserGetRequest>();
    return request.user;
  },
);
