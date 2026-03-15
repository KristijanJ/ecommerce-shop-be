import { Controller } from '@nestjs/common';

// User has no public endpoints — managed via AuthModule
@Controller('user')
export class UserController {}
