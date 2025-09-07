import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';

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
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async endingByIngredient(ingredientPublicId: string, dateStr?: string) {
    const date = toDateOnly(dateStr);

    const ingredient = await this.prisma.ingredient.findUnique({ where: { publicId: ingredientPublicId } });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    const [inAgg, outAgg] = await Promise.all([
      this.prisma.stockInSnapshot.aggregate({ _sum: { quantityIn: true }, where: { ingredientId: ingredient.id, stockDate: { lte: date as any } } }),
      this.prisma.stockOutSnapshot.aggregate({ _sum: { quantityOut: true }, where: { ingredientId: ingredient.id, stockDate: { lte: date as any } } }),
    ]);

    const cumIn = (inAgg._sum.quantityIn ?? 0) as any as number;
    const cumOut = (outAgg._sum.quantityOut ?? 0) as any as number;
    let ending = cumIn - cumOut;

    if (isToday(date)) {
      const [todayIn, todayOut] = await Promise.all([
        this.prisma.stockInDailyItem.aggregate({ _sum: { quantity: true }, where: { ingredientId: ingredient.id, stockDate: date as any } }),
        this.prisma.stockOutDailyItem.aggregate({ _sum: { quantity: true }, where: { ingredientId: ingredient.id, stockDate: date as any } }),
      ]);
      ending += ((todayIn._sum.quantity ?? 0) as any as number) - ((todayOut._sum.quantity ?? 0) as any as number);
    }

    return { ingredientPublicId, date: date.toISOString().slice(0, 10), ending };
  }
}

