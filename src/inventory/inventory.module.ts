import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryCloseDayService } from './services/inventory-close-day.service';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryCloseDayService],
  exports: [InventoryService, InventoryCloseDayService],
})
export class InventoryModule {}
