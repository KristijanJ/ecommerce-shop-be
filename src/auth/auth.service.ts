import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import { JwtPayload } from './strategies/jwt.strategy';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.getUser({
      email: dto.email,
      withPassword: true,
    });

    if (!user) throw new NotFoundException();

    const valid = await bcrypt.compare(dto.password, user.password!);
    if (!valid) throw new UnauthorizedException();

    return { token: this.signToken(user) };
  }

  async register(dto: RegisterDto) {
    if (dto.email !== dto.confirmEmail) {
      throw new BadRequestException('Emails must match.');
    }

    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);

    let user;
    try {
      user = await this.userService.createUser({
        email: dto.email,
        password: hashed,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      });
    } catch (err) {
      if (err instanceof Error && err.message === 'user_with_email_exists') {
        throw new BadRequestException('A user with this email already exists.');
      }
      throw err;
    }

    return { token: this.signToken(user) };
  }

  private signToken(user: { id: number; email: string; firstName: string; lastName: string; roles: string[] }) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }
}
