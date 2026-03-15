import { Controller } from '@nestjs/common';

// No public RBAC endpoints — managed internally via guards
@Controller('rbac')
export class RbacController {}
