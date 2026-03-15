import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Email is required.' })
  email: string;

  @IsString()
  @MinLength(1, { message: 'Password cannot be empty.' })
  password: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email is required.' })
  email: string;

  @IsEmail({}, { message: 'Confirm Email is required.' })
  confirmEmail: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain 8 or more characters.' })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name cannot be empty.' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty.' })
  lastName: string;

  @IsEnum(['buyer', 'seller'], { message: 'Role must be buyer or seller.' })
  role: 'buyer' | 'seller';
}

// keep alias for NestJS scaffold compatibility
export class CreateAuthDto extends LoginDto {}
