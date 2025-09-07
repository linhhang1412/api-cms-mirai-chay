import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';

function toDateOnly(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

@Injectable()
export class StockOutCloseDayService {
  constructor(private readonly prisma: PrismaService) {}

  async closeDay(dateStr: string) {
    const date = toDateOnly(dateStr);
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

