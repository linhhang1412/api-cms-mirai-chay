import { Module } from '@nestjs/common';
import { StockInController } from './stock-in.controller';
import { StockInDailyService } from './services/daily.service';
import { StockInItemService } from './services/item.service';
import { StockInCloseDayService } from './services/close-day.service';

@Module({
  imports: [],
  controllers: [StockInController],
  providers: [StockInDailyService, StockInItemService, StockInCloseDayService],
  exports: [StockInDailyService, StockInItemService, StockInCloseDayService],
})
export class StockInModule {}
