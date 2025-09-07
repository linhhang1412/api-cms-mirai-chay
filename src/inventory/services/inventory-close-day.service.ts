import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { randomUUID } from 'crypto';

function toDateOnly(dateStr?: string): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

@Injectable()
export class InventoryCloseDayService {
  private readonly logger = new Logger(InventoryCloseDayService.name);

  constructor(private readonly prisma: PrismaService) {}

  async closeDay(dateStr: string) {
    const date = toDateOnly(dateStr);

    await this.prisma.$transaction(async (tx) => {
      // STOCK IN: copy daily -> history
      const inDailies = await tx.stockInDaily.findMany({ where: { stockDate: date as any } });
      for (const d of inDailies) {
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

      // STOCK IN: snapshot
      const inGrouped = await tx.stockInDailyItem.groupBy({
        by: ['ingredientId'],
        where: { stockDate: date as any },
        _sum: { quantity: true },
      });
      for (const g of inGrouped) {
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

      // STOCK OUT: copy daily -> history
      const outDailies = await tx.stockOutDaily.findMany({ where: { stockDate: date as any } });
      for (const d of outDailies) {
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

      // STOCK OUT: snapshot
      const outGrouped = await tx.stockOutDailyItem.groupBy({
        by: ['ingredientId'],
        where: { stockDate: date as any },
        _sum: { quantity: true },
      });
      for (const g of outGrouped) {
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

    this.logger.log(`Inventory close-day completed for ${date.toISOString().slice(0, 10)}`);
    return { success: true };
  }
}

