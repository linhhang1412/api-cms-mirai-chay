import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { AddStockOutItemDto } from '../dto/add-item.dto';
import { UpdateStockOutItemDto } from '../dto/update-item.dto';

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

@Injectable()
export class StockOutItemService {
  constructor(private readonly prisma: PrismaService) {}

  async add(dailyPublicId: string, dto: AddStockOutItemDto) {
    const daily = await this.prisma.stockOutDaily.findUnique({ where: { publicId: dailyPublicId } });
    if (!daily) throw new NotFoundException('StockOutDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');

    const ingredient = await this.prisma.ingredient.findUnique({ where: { publicId: dto.ingredientPublicId } });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    return await this.prisma.stockOutDailyItem.create({
      data: {
        publicId: randomUUID(),
        dailyId: daily.id,
        stockDate: daily.stockDate as any,
        ingredientId: ingredient.id,
        quantity: dto.quantity as any,
        note: dto.note,
        createdByUserId: dto.createdByUserId,
        createdAt: new Date(),
      },
    });
  }

  async update(itemPublicId: string, dto: UpdateStockOutItemDto) {
    const item = await this.prisma.stockOutDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    return await this.prisma.stockOutDailyItem.update({
      where: { publicId: itemPublicId },
      data: { quantity: dto.quantity as any, note: dto.note, updatedByUserId: dto.updatedByUserId, updatedAt: new Date() },
    });
  }

  async remove(itemPublicId: string) {
    const item = await this.prisma.stockOutDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    await this.prisma.stockOutDailyItem.delete({ where: { publicId: itemPublicId } });
    return { success: true };
  }
}

