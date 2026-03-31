import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserInternalDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthMessageDto } from 'src/auth/dto/auth-response.dto';

@Injectable()
export class UsersService {
  // TODO: substituir por repositório do banco de dados
  private readonly users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    // TODO: this.prisma.user.findUnique({ where: { email } })
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User | undefined> {
    // TODO: this.prisma.user.findUnique({ where: { id } })
    return this.users.find((user) => user.id === id);
  }

  async create(user: CreateUserInternalDto): Promise<AuthMessageDto> {
    const emailInUse = await this.findByEmail(user.email);
    if (emailInUse) {
      throw new ConflictException('Email already in use');
    }
    const userCreate: User = {
      ...user,
      id: randomUUID(),
      isActive: true,
      createdAt: new Date(),
    };

    // TODO: this.prisma.user.create({ data: user })
    this.users.push(userCreate);
    return { message: 'User created successfully' };
  }
}
