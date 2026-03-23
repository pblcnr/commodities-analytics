import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

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

  async create(dto: CreateUserDto, passwordHash: string): Promise<User> {
    const emailInUse = await this.findByEmail(dto.email);
    if (emailInUse) {
      throw new ConflictException('Email already in use');
    }
    const user: User = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      passwordHash,
      isActive: true,
      createdAt: new Date(),
    };
    // TODO: this.prisma.user.create({ data: user })
    this.users.push(user);
    return user;
  }
}
