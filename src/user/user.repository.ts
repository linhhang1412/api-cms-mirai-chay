import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { UserEntity } from './entities/user.entity';
import { Status } from 'generated/prisma';
import { Prisma } from 'generated/prisma';
import { UserMessages } from './constants';

@Injectable()
export class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<UserEntity> {
    try {
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation
        if (error.code === 'P2002') {
          throw new BadRequestException(UserMessages.ERROR.EMAIL_ALREADY_EXISTS);
        }
      }
      this.logger.error(UserMessages.ERROR.CREATE_USER_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(UserMessages.ERROR.CREATE_USER_FAILED);
    }
  }

  async update(id: number, data: Partial<CreateUserDto>): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          emailOtps: true,
        },
      });
      return new UserEntity(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Record not found
        if (error.code === 'P2025') {
          throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
        }
        // Unique constraint violation
        if (error.code === 'P2002') {
          throw new BadRequestException(UserMessages.ERROR.EMAIL_ALREADY_EXISTS);
        }
      }
      this.logger.error(
        `${UserMessages.ERROR.UPDATE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.UPDATE_USER_FAILED,
      );
    }
  }

  async findById(id: number): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          emailOtps: true,
        },
      });
      return user ? new UserEntity(user) : null;
    } catch (error) {
      this.logger.error(
        `${UserMessages.ERROR.FETCH_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.FETCH_USER_FAILED,
      );
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          emailOtps: true,
        },
      });
      return user ? new UserEntity(user) : null;
    } catch (error) {
      this.logger.error(
        `${UserMessages.ERROR.FETCH_USER_FAILED}: ${email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.FETCH_USER_FAILED,
      );
    }
  }

  async findByPublicId(publicId: string): Promise<UserEntity | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { publicId },
        include: {
          emailOtps: true,
        },
      });
      return user ? new UserEntity(user) : null;
    } catch (error) {
      this.logger.error(
        `${UserMessages.ERROR.FETCH_USER_FAILED}: ${publicId}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.FETCH_USER_FAILED,
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserEntity[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            emailOtps: true,
          },
        }),
        this.prisma.user.count(),
      ]);

      return {
        users: users.map((u) => new UserEntity(u)),
        total,
      };
    } catch (error) {
      this.logger.error(UserMessages.ERROR.FETCH_USERS_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(UserMessages.ERROR.FETCH_USERS_FAILED);
    }
  }

  async softDelete(id: number): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          status: Status.INACTIVE,
          updatedAt: new Date(),
        },
        include: {
          emailOtps: true,
        },
      });
      return new UserEntity(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Record not found
        if (error.code === 'P2025') {
          throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
        }
      }
      this.logger.error(
        `${UserMessages.ERROR.DEACTIVATE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.DEACTIVATE_USER_FAILED,
      );
    }
  }

  async hardDelete(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Record not found
        if (error.code === 'P2025') {
          throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
        }
      }
      this.logger.error(
        `${UserMessages.ERROR.DELETE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.DELETE_USER_FAILED,
      );
    }
  }

  async setLastOtpSentAt(id: number, when: Date): Promise<UserEntity> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          lastOtpSentAt: when,
          updatedAt: new Date(),
        },
        include: {
          emailOtps: true,
        },
      });
      return new UserEntity(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
        }
      }
      this.logger.error(
        `${UserMessages.ERROR.UPDATE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.UPDATE_USER_FAILED,
      );
    }
  }
}
