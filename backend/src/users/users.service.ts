import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInternalDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { AuthMessageDto } from 'src/auth/dto/auth-response.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const adminEmail = 'admin@commodities.com';
    const existingAdmin = await this.findByEmail(adminEmail);
    if (!existingAdmin) {
      await this.prisma.usuario.create({
        data: {
          nome: 'Administrador',
          email: adminEmail,
          senha_hash: bcrypt.hashSync('admin123', 10),
        },
      });
      console.log(`[Usuário Padrão] Email: ${adminEmail} | Senha: admin123`);
    }
  }

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

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        criado_em: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data: any = {};
    if (updateUserDto.name) data.nome = updateUserDto.name;
    if (updateUserDto.email) data.email = updateUserDto.email;
    if (updateUserDto.password) {
      data.senha_hash = bcrypt.hashSync(updateUserDto.password, 10);
    }
    
    return this.prisma.usuario.update({
      where: { id_usuario: id },
      data,
      select: {
        id_usuario: true,
        nome: true,
        email: true,
      }
    });
  }

  async remove(id: number) {
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
      select: { id_usuario: true }
    });
  }
}
