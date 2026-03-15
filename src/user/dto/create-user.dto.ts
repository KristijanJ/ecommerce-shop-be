import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email is required.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain 8 or more characters.' })
  password: string;

  @IsString()
  @MinLength(1, { message: 'First name cannot be empty.' })
  firstName: string;

  @IsString()
  @MinLength(1, { message: 'Last name cannot be empty.' })
  lastName: string;
}
