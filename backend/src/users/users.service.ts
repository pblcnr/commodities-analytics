import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInternalDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { AuthMessageDto } from 'src/auth/dto/auth-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
  }

  async create(user: CreateUserInternalDto): Promise<AuthMessageDto> {
    const emailInUse = await this.findByEmail(user.email);
    if (emailInUse) {
      throw new ConflictException('Email already in use');
    }

    await this.prisma.usuario.create({
      data: {
        nome: user.name,
        email: user.email,
        senha_hash: user.passwordHash,
      },
    });

    return { message: 'User created successfully' };
  }
}
