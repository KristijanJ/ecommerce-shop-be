import { TestingModuleBuilder } from '@nestjs/testing';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../rbac/guards/permissions.guard';

export const jwtGuardMock = { canActivate: jest.fn(() => true) };
export const permissionsGuardMock = { canActivate: jest.fn(() => true) };

export function mockGuards(builder: TestingModuleBuilder): TestingModuleBuilder {
  return builder
    .overrideGuard(JwtAuthGuard).useValue(jwtGuardMock)
    .overrideGuard(PermissionsGuard).useValue(permissionsGuardMock);
}
