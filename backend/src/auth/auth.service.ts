import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User): Promise<AuthResponseDto> {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const SALT_ROUNDS = 10;
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create(dto, passwordHash);
    return this.login(user);
  }
}
