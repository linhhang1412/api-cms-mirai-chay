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

