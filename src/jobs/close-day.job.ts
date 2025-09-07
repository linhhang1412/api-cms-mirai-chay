import { Injectable, Logger } from '@nestjs/common';
import { InventoryCloseDayService } from '../inventory/services/inventory-close-day.service';

function formatDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

@Injectable()
export class CloseDayJob {
  private readonly logger = new Logger(CloseDayJob.name);

  constructor(private readonly inventoryCloseDay: InventoryCloseDayService) {}

  // Runner function; dynamic scheduler will call this
  async runForYesterday() {
    const now = new Date();
    const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const dateStr = formatDate(y);
    await this.runFor(dateStr);
  }

  async runFor(dateStr: string) {
    this.logger.log(`Running close-day for date=${dateStr}`);
    await this.inventoryCloseDay.closeDay(dateStr);
    this.logger.log(`Close-day completed for date=${dateStr}`);
  }
}
