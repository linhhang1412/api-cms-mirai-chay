import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UserEntity } from './entities/user.entity';
import { Status, User } from 'generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    const now = new Date();
    const user = await this.prisma.user.create({
      data: {
        ...data,
        publicId: randomUUID(),
        createdAt: now,
        updatedAt: now,
      },
    });
    return new UserEntity(user);
  }

  async update(id: number, data: Partial<CreateUserDto>): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return new UserEntity(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? new UserEntity(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? new UserEntity(user) : null;
  }

  async findByPublicId(publicId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { publicId } });
    return user ? new UserEntity(user) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => new UserEntity(u));
  }

  async softDelete(id: number): Promise<UserEntity> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        status: Status.INACTIVE,
        updatedAt: new Date(),
      },
    });
    return new UserEntity(user);
  }

  async hardDelete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
