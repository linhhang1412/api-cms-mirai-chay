import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { AddStockInItemDto } from '../dto/add-item.dto';
import { UpdateStockInItemDto } from '../dto/update-item.dto';

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

@Injectable()
export class StockInItemService {
  constructor(private readonly prisma: PrismaService) { }

  async add(dailyPublicId: string, dto: AddStockInItemDto) {
    const daily = await this.prisma.stockInDaily.findUnique({ where: { publicId: dailyPublicId } });
    if (!daily) throw new NotFoundException('StockInDaily not found');
    if (!isToday(daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');

    const ingredient = await this.prisma.ingredient.findUnique({ where: { publicId: dto.ingredientPublicId } });
    if (!ingredient) throw new NotFoundException('Ingredient not found');
    return await this.prisma.stockInDailyItem.create({
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
  }

  async update(itemPublicId: string, dto: UpdateStockInItemDto) {
    const item = await this.prisma.stockInDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    return await this.prisma.stockInDailyItem.update({
      where: { publicId: itemPublicId },
      data: {
        quantity: dto.quantity as any,
        note: dto.note,
        updatedByUserId: dto.updatedByUserId,
        updatedAt: new Date(),
      },
    });
  }

  async remove(itemPublicId: string) {
    const item = await this.prisma.stockInDailyItem.findUnique({ where: { publicId: itemPublicId }, include: { daily: true } });
    if (!item) throw new NotFoundException('Item not found');
    if (!isToday(item.daily.stockDate as unknown as Date)) throw new BadRequestException('Chỉ được thêm/sửa/xóa trong ngày');
    await this.prisma.stockInDailyItem.delete({ where: { publicId: itemPublicId } });
    return { success: true };
  }
}

