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

  async list(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ items: IngredientEntity[]; total: number }> {
    try {
      // If search term provided, use FTS + trigram with indexes
      if (search && search.trim().length > 0) {
        const q = search.trim();
        const offset = (page - 1) * limit;

        // Items query using FTS + trigram across ingredient + category + unit
        const items = (await this.prisma.$queryRaw<any[]>`
          SELECT i.*
          FROM "ingredients" i
          LEFT JOIN "ingredient_categories" c ON c."id" = i."categoryId"
          LEFT JOIN "ingredient_units" u ON u."id" = i."unitId"
          WHERE
            -- Ingredient FTS
            to_tsvector('simple', unaccent(coalesce(i."code", '') || ' ' || coalesce(i."name", '')))
              @@ plainto_tsquery('simple', unaccent(${q}))
            OR i."name" % ${q}
            OR i."code" % ${q}
            -- Category FTS & trigram
            OR (c."id" IS NOT NULL AND (
              to_tsvector('simple', unaccent(coalesce(c."code", '') || ' ' || coalesce(c."name", '')))
                @@ plainto_tsquery('simple', unaccent(${q}))
              OR c."name" % ${q}
              OR c."code" % ${q}
            ))
            -- Unit FTS & trigram
            OR (u."id" IS NOT NULL AND (
              to_tsvector('simple', unaccent(coalesce(u."code", '') || ' ' || coalesce(u."name", '')))
                @@ plainto_tsquery('simple', unaccent(${q}))
              OR u."name" % ${q}
              OR u."code" % ${q}
            ))
          ORDER BY
            GREATEST(
              ts_rank_cd(
                to_tsvector('simple', unaccent(coalesce(i."code", '') || ' ' || coalesce(i."name", ''))),
                plainto_tsquery('simple', unaccent(${q}))
              ),
              COALESCE(similarity(i."name", ${q}), 0),
              COALESCE(similarity(i."code", ${q}), 0),
              COALESCE(similarity(c."name", ${q}), 0),
              COALESCE(similarity(c."code", ${q}), 0),
              COALESCE(similarity(u."name", ${q}), 0),
              COALESCE(similarity(u."code", ${q}), 0)
            ) DESC,
            i."createdAt" DESC
          LIMIT ${limit} OFFSET ${offset}
        `) as any[];

        const countRows = (await this.prisma.$queryRaw<any[]>`
          SELECT COUNT(*)::int AS cnt
          FROM "ingredients" i
          LEFT JOIN "ingredient_categories" c ON c."id" = i."categoryId"
          LEFT JOIN "ingredient_units" u ON u."id" = i."unitId"
          WHERE
            to_tsvector('simple', unaccent(coalesce(i."code", '') || ' ' || coalesce(i."name", '')))
              @@ plainto_tsquery('simple', unaccent(${q}))
            OR i."name" % ${q}
            OR i."code" % ${q}
            OR (c."id" IS NOT NULL AND (
              to_tsvector('simple', unaccent(coalesce(c."code", '') || ' ' || coalesce(c."name", '')))
                @@ plainto_tsquery('simple', unaccent(${q}))
              OR c."name" % ${q}
              OR c."code" % ${q}
            ))
            OR (u."id" IS NOT NULL AND (
              to_tsvector('simple', unaccent(coalesce(u."code", '') || ' ' || coalesce(u."name", '')))
                @@ plainto_tsquery('simple', unaccent(${q}))
              OR u."name" % ${q}
              OR u."code" % ${q}
            ))
        `) as Array<{ cnt: number } | { cnt: string }>;

        const total = parseInt((countRows?.[0] as any)?.cnt ?? '0', 10);
        return { items: items.map((r) => new IngredientEntity(r)), total };
      }

      // No search: default Prisma query
      const [records, total] = await Promise.all([
        this.prisma.ingredient.findMany({
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.ingredient.count(),
      ]);
      return { items: records.map((r) => new IngredientEntity(r)), total };
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
