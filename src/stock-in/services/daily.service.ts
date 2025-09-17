import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateStockInDailyDto } from '../dto/create-daily.dto';
import { UpdateStockInDailyDto } from '../dto/update-daily.dto';

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
export class StockInDailyService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateStockInDailyDto) {
    const date = toDateOnly(dto.stockDate);
    const createdByUserId = dto.createdByUserId ?? 0;
    return await this.prisma.stockInDaily.create({
      data: {
        publicId: randomUUID(),
        stockDate: date as any,
        note: dto.note,
        createdByUserId,
        createdAt: new Date(),
      },
    });
  }

  async get(publicId: string) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId }, include: { items: true } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    return daily;
  }

  async listToday() {
    const date = toDateOnly();
    const where = { stockDate: date as any } as any;
    const items = await this.prisma.stockInDaily.findMany({ 
      where, 
      orderBy: { createdAt: 'desc' }, 
      include: { _count: { select: { items: true } } } 
    });
    return items;
  }

  async listHistory(fromStr?: string, toStr?: string) {
    const today = toDateOnly();
    let from: Date;
    let to: Date;
    try {
      from = fromStr ? toDateOnly(fromStr) : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30);
      const defaultTo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
      to = toStr ? toDateOnly(toStr) : defaultTo;
    } catch {
      throw new BadRequestException('Invalid date range');
    }
    const where = { stockDate: { gte: from as any, lte: to as any } } as any;
    const items = await this.prisma.stockInDaily.findMany({ 
      where, 
      orderBy: { stockDate: 'desc' }, 
      include: { _count: { select: { items: true } } } 
    });
    return items;
  }

  async update(publicId: string, dto: UpdateStockInDailyDto) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    return await this.prisma.stockInDaily.update({
      where: { publicId },
      data: { note: dto.note, updatedByUserId: dto.updatedByUserId, updatedAt: new Date() },
    });
  }

  async delete(publicId: string) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    await this.prisma.stockInDaily.delete({ where: { publicId } });
    return { success: true };
  }
}
