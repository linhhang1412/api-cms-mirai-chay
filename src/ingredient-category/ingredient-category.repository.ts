import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { IngredientCategoryMessages } from './constants';
import { Prisma } from 'generated/prisma';
import { CreateIngredientCategoryDto } from './dto/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from './dto/update-ingredient-category.dto';
import { IngredientCategoryEntity } from './entities/ingredient-category.entity';

@Injectable()
export class IngredientCategoryRepository {
  private readonly logger = new Logger(IngredientCategoryRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateIngredientCategoryDto) {
    try {
      const now = new Date();
      const rec = await this.prisma.ingredientCategory.create({
        data: { code: dto.code, name: dto.name, active: dto.active ?? true, createdAt: now, updatedAt: now },
      });
      return new IngredientCategoryEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(IngredientCategoryMessages.ERROR.CODE_EXISTS);
      }
      this.logger.error(IngredientCategoryMessages.ERROR.CREATE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.CREATE_FAILED);
    }
  }

  async update(id: number, dto: UpdateIngredientCategoryDto) {
    try {
      const rec = await this.prisma.ingredientCategory.update({
        where: { id },
        data: { ...dto, updatedAt: new Date() },
      });
      return new IngredientCategoryEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new NotFoundException(IngredientCategoryMessages.ERROR.NOT_FOUND);
        if (error.code === 'P2002') throw new BadRequestException(IngredientCategoryMessages.ERROR.CODE_EXISTS);
      }
      this.logger.error(IngredientCategoryMessages.ERROR.UPDATE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.UPDATE_FAILED);
    }
  }

  async findById(id: number) {
    try {
      const rec = await this.prisma.ingredientCategory.findUnique({ where: { id } });
      return rec ? new IngredientCategoryEntity(rec) : null;
    } catch (error) {
      this.logger.error(IngredientCategoryMessages.ERROR.FETCH_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.FETCH_FAILED);
    }
  }

  async list(page = 1, limit = 10, search?: string) {
    try {
      if (search && search.trim()) {
        const q = search.trim();
        const offset = (page - 1) * limit;
        const items = (await this.prisma.$queryRaw<any[]>`
          SELECT c.*
          FROM "ingredient_categories" c
          WHERE to_tsvector('simple', unaccent(coalesce(c."code", '') || ' ' || coalesce(c."name", '')))
                  @@ plainto_tsquery('simple', unaccent(${q}))
             OR c."name" % ${q}
             OR c."code" % ${q}
          ORDER BY GREATEST(
                   ts_rank_cd(to_tsvector('simple', unaccent(coalesce(c."code", '') || ' ' || coalesce(c."name", ''))),
                              plainto_tsquery('simple', unaccent(${q}))),
                   similarity(c."name", ${q}),
                   similarity(c."code", ${q})
                 ) DESC, c."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `) as any[];
        const countRows = (await this.prisma.$queryRaw<any[]>`
          SELECT COUNT(*)::int AS cnt
          FROM "ingredient_categories" c
          WHERE to_tsvector('simple', unaccent(coalesce(c."code", '') || ' ' || coalesce(c."name", '')))
                  @@ plainto_tsquery('simple', unaccent(${q}))
             OR c."name" % ${q}
             OR c."code" % ${q}
        `) as Array<{ cnt: number } | { cnt: string }>;
        const total = parseInt((countRows?.[0] as any)?.cnt ?? '0', 10);
        return { items: items.map((r) => new IngredientCategoryEntity(r)), total };
      }
      const [records, total] = await Promise.all([
        this.prisma.ingredientCategory.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' } }),
        this.prisma.ingredientCategory.count(),
      ]);
      return { items: records.map((r) => new IngredientCategoryEntity(r)), total };
    } catch (error) {
      this.logger.error(IngredientCategoryMessages.ERROR.FETCH_LIST_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.FETCH_LIST_FAILED);
    }
  }

  async softDelete(id: number) {
    try {
      const rec = await this.prisma.ingredientCategory.update({ where: { id }, data: { active: false, updatedAt: new Date() } });
      return new IngredientCategoryEntity(rec);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(IngredientCategoryMessages.ERROR.NOT_FOUND);
      }
      this.logger.error(IngredientCategoryMessages.ERROR.DELETE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.DELETE_FAILED);
    }
  }

  async hardDelete(id: number) {
    try {
      await this.prisma.ingredientCategory.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(IngredientCategoryMessages.ERROR.NOT_FOUND);
      }
      this.logger.error(IngredientCategoryMessages.ERROR.DELETE_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(IngredientCategoryMessages.ERROR.DELETE_FAILED);
    }
  }
}

