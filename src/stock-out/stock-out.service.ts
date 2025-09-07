import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateStockOutDailyDto } from './dto/create-daily.dto';
import { AddStockOutItemDto } from './dto/add-item.dto';
import { UpdateStockOutItemDto } from './dto/update-item.dto';
import { CloseOutDayDto } from './dto/close-day.dto';
import { UpdateStockOutDailyDto } from './dto/update-daily.dto';

function toDateOnly(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

@Injectable()
export class StockOutService {
  private readonly logger = new Logger(StockOutService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createDaily(dto: CreateStockOutDailyDto) {
    const date = toDateOnly(dto.stockDate);
    const createdByUserId = dto.createdByUserId ?? 0;
    const rec = await this.prisma.stockOutDaily.create({
      data: {
        publicId: randomUUID(),
        stockDate: date as any,
        note: dto.note,
        createdByUserId,
        createdAt: new Date(),
      },
    });
    return rec;
  }

  async getDaily(publicId: string) {
    const daily = await this.prisma.stockOutDaily.findUnique({
      where: { publicId },
      include: { items: true },
    });
    if (!daily) throw new NotFoundException('StockOutDaily not found');
    return daily;
  }

  async updateDaily(publicId: string, dto: UpdateStockOutDailyDto) {
    const daily = await this.prisma.stockOutDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockOutDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    const updated = await this.prisma.stockOutDaily.update({
      where: { publicId },
      data: { note: dto.note, updatedByUserId: dto.updatedByUserId, updatedAt: new Date() },
    });
    return updated;
  }

  async deleteDaily(publicId: string) {
    const daily = await this.prisma.stockOutDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockOutDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    await this.prisma.stockOutDaily.delete({ where: { publicId } });
    return { success: true };
  }

  async addItem(dailyPublicId: string, dto: AddStockOutItemDto) {
    const daily = await this.prisma.stockOutDaily.findUnique({ where: { publicId: dailyPublicId } });
    if (!daily) throw new NotFoundException('StockOutDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }

    const ingredient = await this.prisma.ingredient.findUnique({ where: { publicId: dto.ingredientPublicId } });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    const item = await this.prisma.stockOutDailyItem.create({
      data: {
        publicId: randomUUID(),
        dailyId: daily.id,
        stockDate: daily.stockDate as any,
        ingredientId: ingredient.id,
        quantity: (dto.quantity as any),
        note: dto.note,
        createdByUserId: dto.createdByUserId,
        createdAt: new Date(),
      },
    });
    return item;
  }

  async updateItem(itemPublicId: string, dto: UpdateStockOutItemDto) {
    const item = await this.prisma.stockOutDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    const updated = await this.prisma.stockOutDailyItem.update({
      where: { publicId: itemPublicId },
      data: {
        quantity: dto.quantity as any,
        note: dto.note,
        updatedByUserId: dto.updatedByUserId,
        updatedAt: new Date(),
      },
    });
    return updated;
  }

  async deleteItem(itemPublicId: string) {
    const item = await this.prisma.stockOutDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    await this.prisma.stockOutDailyItem.delete({ where: { publicId: itemPublicId } });
    return { success: true };
  }

  async closeDay(dto: CloseOutDayDto) {
    const date = toDateOnly(dto.date);
    await this.prisma.$transaction(async (tx) => {
      const dailies = await tx.stockOutDaily.findMany({ where: { stockDate: date as any } });
      for (const d of dailies) {
        const hist = await tx.stockOutHistory.create({
          data: {
            publicId: randomUUID(),
            dailyId: d.id,
            stockDate: date as any,
            note: d.note,
            createdByUserId: d.createdByUserId,
            createdAt: d.createdAt,
            updatedByUserId: d.updatedByUserId ?? undefined,
            updatedAt: d.updatedAt ?? undefined,
          },
        });
        const items = await tx.stockOutDailyItem.findMany({ where: { dailyId: d.id } });
        if (items.length) {
          await tx.stockOutHistoryItem.createMany({
            data: items.map((it) => ({
              publicId: randomUUID(),
              historyId: hist.id,
              stockDate: date as any,
              ingredientId: it.ingredientId,
              quantity: it.quantity as any,
              note: it.note ?? undefined,
              createdByUserId: it.createdByUserId,
              createdAt: it.createdAt,
              updatedByUserId: it.updatedByUserId ?? undefined,
              updatedAt: it.updatedAt ?? undefined,
            })),
          });
        }
      }

      // Snapshot out
      const grouped = await tx.stockOutDailyItem.groupBy({
        by: ['ingredientId'],
        where: { stockDate: date as any },
        _sum: { quantity: true },
      });
      for (const g of grouped) {
        const ingredientId = g.ingredientId;
        const quantityOut = g._sum.quantity ?? (0 as any);
        await tx.stockOutSnapshot.upsert({
          where: { stockDate_ingredientId: { stockDate: date as any, ingredientId } },
          update: { quantityOut: quantityOut as any, updatedAt: new Date() },
          create: {
            publicId: randomUUID(),
            stockDate: date as any,
            ingredientId,
            quantityOut: quantityOut as any,
            createdAt: new Date(),
          },
        });
      }
    });
    return { success: true };
  }
}
