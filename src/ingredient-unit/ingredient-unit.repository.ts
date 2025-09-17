import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { Prisma } from 'generated/prisma';
import { IngredientUnitMessages } from './constants';
import { CreateIngredientUnitDto } from './dto/create-ingredient-unit.dto';
import { UpdateIngredientUnitDto } from './dto/update-ingredient-unit.dto';
import { IngredientUnitEntity } from './entities/ingredient-unit.entity';

@Injectable()
export class IngredientUnitRepository {
  private readonly logger = new Logger(IngredientUnitRepository.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIngredientUnitDto) {
    try {
      const now = new Date();
      const rec = await this.prisma.ingredientUnit.create({ data: { code: dto.code, name: dto.name, active: dto.active ?? true, createdAt: now, updatedAt: now } });
      return new IngredientUnitEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(IngredientUnitMessages.ERROR.CODE_EXISTS);
      }
      this.logger.error(IngredientUnitMessages.ERROR.CREATE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.CREATE_FAILED);
    }
  }

  async update(id: number, dto: UpdateIngredientUnitDto) {
    try {
      const rec = await this.prisma.ingredientUnit.update({ where: { id }, data: { ...dto, updatedAt: new Date() } });
      return new IngredientUnitEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException(IngredientUnitMessages.ERROR.NOT_FOUND);
        if (error.code === 'P2002') throw new BadRequestException(IngredientUnitMessages.ERROR.CODE_EXISTS);
      }
      this.logger.error(IngredientUnitMessages.ERROR.UPDATE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.UPDATE_FAILED);
    }
  }

  async findById(id: number) {
    try {
      const rec = await this.prisma.ingredientUnit.findUnique({ where: { id } });
      return rec ? new IngredientUnitEntity(rec) : null;
    } catch (error) {
      this.logger.error(IngredientUnitMessages.ERROR.FETCH_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.FETCH_FAILED);
    }
  }

  async list() {
    try {
      const records = await this.prisma.ingredientUnit.findMany({ 
        orderBy: { createdAt: 'desc' } 
      });
      return { items: records.map((r) => new IngredientUnitEntity(r)) };
    } catch (error) {
      this.logger.error(IngredientUnitMessages.ERROR.FETCH_LIST_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.FETCH_LIST_FAILED);
    }
  }

  async softDelete(id: number) {
    try {
      const rec = await this.prisma.ingredientUnit.update({ where: { id }, data: { active: false, updatedAt: new Date() } });
      return new IngredientUnitEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(IngredientUnitMessages.ERROR.NOT_FOUND);
      }
      this.logger.error(IngredientUnitMessages.ERROR.DELETE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.DELETE_FAILED);
    }
  }

  async hardDelete(id: number) {
    try {
      await this.prisma.ingredientUnit.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(IngredientUnitMessages.ERROR.NOT_FOUND);
      }
      this.logger.error(IngredientUnitMessages.ERROR.DELETE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientUnitMessages.ERROR.DELETE_FAILED);
    }
  }
}

