import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';
import { CreateStockInDailyDto } from '../dto/create-daily.dto';
import { UpdateStockInDailyDto } from '../dto/update-daily.dto';
import { StockInDailyItem } from 'generated/prisma';



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

  async create(dto: CreateStockInDailyDto, currentUserId: number) {
    // Kiểm tra nếu không có items thì báo lỗi
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Phải có ít nhất một item trong phiếu nhập');
    }

    const date = toDateOnly();
    const createdByUserId = currentUserId;

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    return await this.prisma.$transaction(async (prisma) => {
      // Tạo phiếu nhập
      const daily = await prisma.stockInDaily.create({
        data: {
          publicId: randomUUID(),
          stockDate: date as any,
          note: dto.note,
          createdByUserId,
          createdAt: new Date(),
        },
      });

      // Tạo các items
      const createdItems: StockInDailyItem[] = [];
      for (const itemDto of dto.items) {
        const ingredient = await prisma.ingredient.findUnique({
          where: { publicId: itemDto.ingredientPublicId }
        });

        if (!ingredient) {
          throw new NotFoundException(`Ingredient with publicId ${itemDto.ingredientPublicId} not found`);
        }

        const item = await prisma.stockInDailyItem.create({
          data: {
            publicId: randomUUID(),
            dailyId: daily.id,
            stockDate: date as any,
            ingredientId: ingredient.id,
            quantity: itemDto.quantity as any,
            note: itemDto.note,
            createdByUserId,
            createdAt: new Date(),
          },
        });

        createdItems.push(item);
      }

      // Trả về thông tin phiếu nhập cùng với các items
      return {
        ...daily,
        items: createdItems
      };
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
