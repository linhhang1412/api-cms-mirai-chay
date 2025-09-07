import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { SystemSettingService } from '../system-setting/system-setting.service';

function toDateOnly(dateStr?: string): Date {
  if (!dateStr) throw new BadRequestException('date is required');
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid date');
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toDateRange(from?: string, to?: string): { from: Date; to: Date } {
  if (!from || !to) throw new BadRequestException('from/to are required');
  const f = new Date(from);
  const t = new Date(to);
  if (Number.isNaN(f.getTime()) || Number.isNaN(t.getTime())) throw new BadRequestException('Invalid date');
  const fd = new Date(f.getFullYear(), f.getMonth(), f.getDate());
  const td = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  return { from: fd, to: td };
}

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService, private readonly settings: SystemSettingService) {}

  // Ending per ingredient on a date (optionally filter by category publicId)
  async endingByDate(dateStr: string, categoryPublicId?: string) {
    const date = toDateOnly(dateStr);

    let ingredientFilterIds: number[] | undefined;
    if (categoryPublicId) {
      const cat = await this.prisma.ingredientCategory.findUnique({ where: { code: categoryPublicId as any } as any });
      if (cat) {
        const ings = await this.prisma.ingredient.findMany({ where: { categoryId: cat.id }, select: { id: true } });
        ingredientFilterIds = ings.map((x) => x.id);
        if (ingredientFilterIds.length === 0) return [];
      }
    }

    const whereIn = ingredientFilterIds ? { ingredientId: { in: ingredientFilterIds } } : {};

    const [inAgg, outAgg] = await Promise.all([
      this.prisma.stockInSnapshot.groupBy({ by: ['ingredientId'], where: { ...whereIn, stockDate: { lte: date as any } }, _sum: { quantityIn: true } }),
      this.prisma.stockOutSnapshot.groupBy({ by: ['ingredientId'], where: { ...whereIn, stockDate: { lte: date as any } }, _sum: { quantityOut: true } }),
    ]);

    // If date is today, add today's daily
    const now = new Date();
    const isToday = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    let todayIn: Record<number, number> = {};
    let todayOut: Record<number, number> = {};
    if (isToday) {
      const [ti, to] = await Promise.all([
        this.prisma.stockInDailyItem.groupBy({ by: ['ingredientId'], where: { ...whereIn, stockDate: date as any }, _sum: { quantity: true } }),
        this.prisma.stockOutDailyItem.groupBy({ by: ['ingredientId'], where: { ...whereIn, stockDate: date as any }, _sum: { quantity: true } }),
      ]);
      ti.forEach((g) => (todayIn[g.ingredientId] = Number(g._sum.quantity || 0)));
      to.forEach((g) => (todayOut[g.ingredientId] = Number(g._sum.quantity || 0)));
    }

    const mapIn = new Map(inAgg.map((g) => [g.ingredientId, Number(g._sum.quantityIn || 0)]));
    const mapOut = new Map(outAgg.map((g) => [g.ingredientId, Number(g._sum.quantityOut || 0)]));
    const ingredientIds = Array.from(new Set<number>([...mapIn.keys(), ...mapOut.keys(), ...Object.keys(todayIn).map(Number), ...Object.keys(todayOut).map(Number)]));

    const ingredients = await this.prisma.ingredient.findMany({ where: { id: { in: ingredientIds } }, select: { id: true, publicId: true, code: true, name: true } });
    return ingredients.map((ing) => {
      const totalIn = (mapIn.get(ing.id) || 0) + (todayIn[ing.id] || 0);
      const totalOut = (mapOut.get(ing.id) || 0) + (todayOut[ing.id] || 0);
      return { ingredientPublicId: ing.publicId, code: ing.code, name: ing.name, ending: totalIn - totalOut, in: totalIn, out: totalOut };
    });
  }

  // Ledger for 1 ingredient: per day qtyIn, qtyOut, ending over range
  async ledger(ingredientPublicId: string, fromStr: string, toStr: string) {
    const { from, to } = toDateRange(fromStr, toStr);
    const ing = await this.prisma.ingredient.findUnique({ where: { publicId: ingredientPublicId } });
    if (!ing) throw new BadRequestException('Ingredient not found');

    const [openInAgg, openOutAgg] = await Promise.all([
      this.prisma.stockInSnapshot.aggregate({ _sum: { quantityIn: true }, where: { ingredientId: ing.id, stockDate: { lt: from as any } } }),
      this.prisma.stockOutSnapshot.aggregate({ _sum: { quantityOut: true }, where: { ingredientId: ing.id, stockDate: { lt: from as any } } }),
    ]);
    let opening = Number(openInAgg._sum.quantityIn || 0) - Number(openOutAgg._sum.quantityOut || 0);

    const inDaily = await this.prisma.stockInSnapshot.findMany({ where: { ingredientId: ing.id, stockDate: { gte: from as any, lte: to as any } }, select: { stockDate: true, quantityIn: true } });
    const outDaily = await this.prisma.stockOutSnapshot.findMany({ where: { ingredientId: ing.id, stockDate: { gte: from as any, lte: to as any } }, select: { stockDate: true, quantityOut: true } });

    const dayKeys = new Set<string>();
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    inDaily.forEach((r) => dayKeys.add(fmt(r.stockDate as unknown as Date)));
    outDaily.forEach((r) => dayKeys.add(fmt(r.stockDate as unknown as Date)));
    const days = Array.from(dayKeys).sort();

    const inMap = new Map(inDaily.map((r) => [fmt(r.stockDate as unknown as Date), Number(r.quantityIn as any || 0)]));
    const outMap = new Map(outDaily.map((r) => [fmt(r.stockDate as unknown as Date), Number(r.quantityOut as any || 0)]));

    const rows = [] as Array<{ date: string; in: number; out: number; ending: number }>;
    let balance = opening;
    for (const d of days) {
      const i = inMap.get(d) || 0;
      const o = outMap.get(d) || 0;
      balance += i - o;
      rows.push({ date: d, in: i, out: o, ending: balance });
    }
    return { ingredientPublicId, opening, rows };
  }

  // Top N ingredients by out quantity in range
  async topOut(fromStr: string, toStr: string, limit = 10) {
    const { from, to } = toDateRange(fromStr, toStr);
    const byIng = await this.prisma.stockOutSnapshot.groupBy({ by: ['ingredientId'], where: { stockDate: { gte: from as any, lte: to as any } }, _sum: { quantityOut: true } });
    const sorted = byIng.map((g) => ({ id: g.ingredientId, qty: Number(g._sum.quantityOut || 0) })).sort((a, b) => b.qty - a.qty).slice(0, limit);
    const ingredients = await this.prisma.ingredient.findMany({ where: { id: { in: sorted.map((s) => s.id) } }, select: { id: true, publicId: true, code: true, name: true } });
    const map = new Map(ingredients.map((i) => [i.id, i]));
    return sorted.map((s) => ({ ingredientPublicId: map.get(s.id)!.publicId, code: map.get(s.id)!.code, name: map.get(s.id)!.name, quantityOut: s.qty }));
  }

  // Daily summary aggregated across all ingredients: qtyIn, qtyOut per day
  async movementSummary(fromStr: string, toStr: string) {
    const { from, to } = toDateRange(fromStr, toStr);
    const inList = await this.prisma.stockInSnapshot.groupBy({ by: ['stockDate'], where: { stockDate: { gte: from as any, lte: to as any } }, _sum: { quantityIn: true } });
    const outList = await this.prisma.stockOutSnapshot.groupBy({ by: ['stockDate'], where: { stockDate: { gte: from as any, lte: to as any } }, _sum: { quantityOut: true } });
    const fmt = (d: any) => (d as Date).toISOString().slice(0, 10);
    const mapIn = new Map(inList.map((r) => [fmt(r.stockDate), Number(r._sum.quantityIn || 0)]));
    const mapOut = new Map(outList.map((r) => [fmt(r.stockDate), Number(r._sum.quantityOut || 0)]));
    const days = Array.from(new Set<string>([...mapIn.keys(), ...mapOut.keys()])).sort();
    return days.map((d) => ({ date: d, in: mapIn.get(d) || 0, out: mapOut.get(d) || 0 }));
  }

  // Stock alerts: low stock and out of stock as of a date
  // - If ingredient.minStock is set, use it; otherwise use defaultThreshold (from param or settings elsewhere)
  // - Optional filter by category code
  async stockAlerts(dateStr: string, defaultThreshold = 0, categoryCode?: string) {
    const date = toDateOnly(dateStr);
    let fallbackThreshold = defaultThreshold;
    if (defaultThreshold === 0 || defaultThreshold == null) {
      const val = await this.settings.getString('default_low_stock_threshold');
      if (val && !isNaN(parseFloat(val))) fallbackThreshold = parseFloat(val);
    }

    // Ingredient filter by category (optional)
    let ingredientWhere: any = {};
    if (categoryCode) {
      const cat = await this.prisma.ingredientCategory.findUnique({ where: { code: categoryCode } });
      if (!cat) return { low: [], out: [] };
      ingredientWhere.categoryId = cat.id;
    }

    const ingredients = await this.prisma.ingredient.findMany({
      where: ingredientWhere,
      select: { id: true, publicId: true, code: true, name: true, minStock: true },
    });
    if (ingredients.length === 0) return { low: [], out: [] };

    const ingredientIds = ingredients.map((i) => i.id);

    // Snapshots cumulative up to date
    const [inAgg, outAgg] = await Promise.all([
      this.prisma.stockInSnapshot.groupBy({ by: ['ingredientId'], where: { ingredientId: { in: ingredientIds }, stockDate: { lte: date as any } }, _sum: { quantityIn: true } }),
      this.prisma.stockOutSnapshot.groupBy({ by: ['ingredientId'], where: { ingredientId: { in: ingredientIds }, stockDate: { lte: date as any } }, _sum: { quantityOut: true } }),
    ]);
    const mapIn = new Map(inAgg.map((g) => [g.ingredientId, Number(g._sum.quantityIn || 0)]));
    const mapOut = new Map(outAgg.map((g) => [g.ingredientId, Number(g._sum.quantityOut || 0)]));

    // If date is today, add today's movements
    const now = new Date();
    const isToday = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
    if (isToday) {
      const [ti, to] = await Promise.all([
        this.prisma.stockInDailyItem.groupBy({ by: ['ingredientId'], where: { ingredientId: { in: ingredientIds }, stockDate: date as any }, _sum: { quantity: true } }),
        this.prisma.stockOutDailyItem.groupBy({ by: ['ingredientId'], where: { ingredientId: { in: ingredientIds }, stockDate: date as any }, _sum: { quantity: true } }),
      ]);
      ti.forEach((g) => mapIn.set(g.ingredientId, (mapIn.get(g.ingredientId) || 0) + Number(g._sum.quantity || 0)));
      to.forEach((g) => mapOut.set(g.ingredientId, (mapOut.get(g.ingredientId) || 0) + Number(g._sum.quantity || 0)));
    }

    const low: any[] = [];
    const out: any[] = [];
    for (const ing of ingredients) {
      const ending = (mapIn.get(ing.id) || 0) - (mapOut.get(ing.id) || 0);
      const threshold = ing.minStock != null ? Number(ing.minStock as any) : fallbackThreshold;
      if (ending <= 0) {
        out.push({ ingredientPublicId: ing.publicId, code: ing.code, name: ing.name, ending });
      } else if (ending <= threshold) {
        low.push({ ingredientPublicId: ing.publicId, code: ing.code, name: ing.name, ending, threshold });
      }
    }
    return { low, out };
  }
}
