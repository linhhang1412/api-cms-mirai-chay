import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateStockInDailyDto } from './dto/create-daily.dto';
import { AddStockInItemDto } from './dto/add-item.dto';
import { UpdateStockInItemDto } from './dto/update-item.dto';
import { CloseDayDto } from './dto/close-day.dto';
import { UpdateStockInDailyDto } from './dto/update-daily.dto';

function toDateOnly(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  // Normalize to 00:00 local time
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
export class StockInService {
  private readonly logger = new Logger(StockInService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createDaily(dto: CreateStockInDailyDto) {
    const date = toDateOnly(dto.stockDate);
    const createdByUserId = dto.createdByUserId ?? 0;
    const rec = await this.prisma.stockInDaily.create({
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
    const daily = await this.prisma.stockInDaily.findUnique({
      where: { publicId },
      include: { items: true },
    });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    return daily;
  }

  async updateDaily(publicId: string, dto: UpdateStockInDailyDto) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    const updated = await this.prisma.stockInDaily.update({
      where: { publicId },
      data: {
        note: dto.note,
        updatedByUserId: dto.updatedByUserId,
        updatedAt: new Date(),
      },
    });
    return updated;
  }

  async deleteDaily(publicId: string) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    await this.prisma.stockInDaily.delete({ where: { publicId } });
    return { success: true };
  }

  async addItem(dailyPublicId: string, dto: AddStockInItemDto) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId: dailyPublicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }

    const ingredient = await this.prisma.ingredient.findUnique({ where: { publicId: dto.ingredientPublicId } });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    const item = await this.prisma.stockInDailyItem.create({
      data: {
        publicId: randomUUID(),
        dailyId: daily.id,
        stockDate: daily.stockDate as any,
        ingredientId: ingredient.id,
        quantity: new (this.prisma as any).Decimal ? new (this.prisma as any).Decimal(dto.quantity) : (dto.quantity as any),
        note: dto.note,
        createdByUserId: dto.createdByUserId,
        createdAt: new Date(),
      },
    });
    return item;
  }

  async updateItem(itemPublicId: string, dto: UpdateStockInItemDto) {
    const item = await this.prisma.stockInDailyItem.findUnique({
      where: { publicId: itemPublicId },
      include: { daily: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }

    const updated = await this.prisma.stockInDailyItem.update({
      where: { publicId: itemPublicId },
      data: {
        quantity: dto.quantity !== undefined ? ((this.prisma as any).Decimal ? new (this.prisma as any).Decimal(dto.quantity) : (dto.quantity as any)) : undefined,
        note: dto.note,
        updatedByUserId: dto.updatedByUserId,
        updatedAt: new Date(),
      },
    });
    return updated;
  }

  async deleteItem(itemPublicId: string) {
    const item = await this.prisma.stockInDailyItem.findUnique({
      where: { publicId: itemPublicId },
      include: { daily: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) {
      throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    }
    await this.prisma.stockInDailyItem.delete({ where: { publicId: itemPublicId } });
    return { success: true };
  }

  async closeDay(dto: CloseDayDto) {
    const date = toDateOnly(dto.date);
    // 1) Copy daily -> history
    await this.prisma.$transaction(async (tx) => {
      const dailies = await tx.stockInDaily.findMany({ where: { stockDate: date as any } });
      for (const d of dailies) {
        const hist = await tx.stockInHistory.create({
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
        const items = await tx.stockInDailyItem.findMany({ where: { dailyId: d.id } });
        if (items.length) {
          await tx.stockInHistoryItem.createMany({
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

      // 2) Snapshot for date (quantityIn per ingredient)
      const grouped = await tx.stockInDailyItem.groupBy({
        by: ['ingredientId'],
        where: { stockDate: date as any },
        _sum: { quantity: true },
      });
      for (const g of grouped) {
        const ingredientId = g.ingredientId;
        const quantityIn = g._sum.quantity ?? (0 as any);
        await tx.stockInSnapshot.upsert({
          where: { stockDate_ingredientId: { stockDate: date as any, ingredientId } },
          update: { quantityIn: quantityIn as any, updatedAt: new Date() },
          create: {
            publicId: randomUUID(),
            stockDate: date as any,
            ingredientId,
            quantityIn: quantityIn as any,
            createdAt: new Date(),
          },
        });
      }
    });

    return { success: true };
  }
}
