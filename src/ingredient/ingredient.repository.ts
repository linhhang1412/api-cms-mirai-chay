import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { randomUUID } from 'crypto';
import { IngredientEntity } from './entities/ingredient.entity';
import { Prisma, Status } from 'generated/prisma';
import { IngredientMessages } from './constants';

@Injectable()
export class IngredientRepository {
  private readonly logger = new Logger(IngredientRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateIngredientDto): Promise<IngredientEntity> {
    try {
      const now = new Date();
      const record = await this.prisma.ingredient.create({
        data: {
          code: data.code,
          name: data.name,
          categoryId: data.categoryId,
          unitId: (data as any).unitId,
          referencePrice: (data as any).referencePrice as any,
          minStock: (data as any).minStock as any,
          status: data.status,
          publicId: randomUUID(),
          createdAt: now,
          updatedAt: now,
        },
      });
      return new IngredientEntity(record);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException(
            IngredientMessages.ERROR.CODE_ALREADY_EXISTS,
          );
        }
      }
      this.logger.error(IngredientMessages.ERROR.CREATE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.CREATE_FAILED,
      );
    }
  }

  async update(id: number, data: UpdateIngredientDto): Promise<IngredientEntity> {
    try {
      const record = await this.prisma.ingredient.update({
        where: { id },
        data: {
          code: data.code,
          name: data.name,
          categoryId: data.categoryId,
          unitId: (data as any).unitId,
          referencePrice: (data as any).referencePrice as any,
          minStock: (data as any).minStock as any,
          status: data.status,
          updatedAt: new Date(),
        },
      });
      return new IngredientEntity(record);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
        }
        if (error.code === 'P2002') {
          throw new BadRequestException(
            IngredientMessages.ERROR.CODE_ALREADY_EXISTS,
          );
        }
      }
      this.logger.error(
        `${IngredientMessages.ERROR.UPDATE_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.UPDATE_FAILED,
      );
    }
  }

  async findById(id: number): Promise<IngredientEntity | null> {
    try {
      const record = await this.prisma.ingredient.findUnique({ where: { id } });
      return record ? new IngredientEntity(record) : null;
    } catch (error) {
      this.logger.error(
        `${IngredientMessages.ERROR.FETCH_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.FETCH_FAILED,
      );
    }
  }

  async findByCode(code: string): Promise<IngredientEntity | null> {
    try {
      const record = await this.prisma.ingredient.findUnique({ where: { code } });
      return record ? new IngredientEntity(record) : null;
    } catch (error) {
      this.logger.error(
        `${IngredientMessages.ERROR.FETCH_FAILED}: ${code}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.FETCH_FAILED,
      );
    }
  }

  async list(): Promise<{ items: IngredientEntity[] }> {
    try {
      const records = await this.prisma.ingredient.findMany({ 
        orderBy: { createdAt: 'desc' } 
      });
      return { items: records.map((r) => new IngredientEntity(r)) };
    } catch (error) {
      this.logger.error(
        IngredientMessages.ERROR.FETCH_LIST_FAILED,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.FETCH_LIST_FAILED,
      );
    }
  }

  async softDelete(id: number): Promise<IngredientEntity> {
    try {
      const record = await this.prisma.ingredient.update({
        where: { id },
        data: { status: Status.INACTIVE, updatedAt: new Date() },
      });
      return new IngredientEntity(record);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
        }
      }
      this.logger.error(
        `${IngredientMessages.ERROR.DELETE_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.DELETE_FAILED,
      );
    }
  }

  async hardDelete(id: number): Promise<void> {
    try {
      await this.prisma.ingredient.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
        }
      }
      this.logger.error(
        `${IngredientMessages.ERROR.DELETE_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        IngredientMessages.ERROR.DELETE_FAILED,
      );
    }
  }

  async updateMinStock(id: number, minStock: number) {
    try {
      const rec = await this.prisma.ingredient.update({ where: { id }, data: { minStock: (minStock as any), updatedAt: new Date() } });
      return new IngredientEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
      }
      this.logger.error(`${IngredientMessages.ERROR.UPDATE_FAILED}: ${id}`, (error as Error).stack);
      throw new InternalServerErrorException(IngredientMessages.ERROR.UPDATE_FAILED);
    }
  }
}
