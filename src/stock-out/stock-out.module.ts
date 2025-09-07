import { Module } from '@nestjs/common';
import { StockOutController } from './stock-out.controller';
import { StockOutDailyService } from './services/daily.service';
import { StockOutItemService } from './services/item.service';
import { StockOutCloseDayService } from './services/close-day.service';

@Module({
  imports: [],
  controllers: [StockOutController],
  providers: [StockOutDailyService, StockOutItemService, StockOutCloseDayService],
  exports: [StockOutDailyService, StockOutItemService, StockOutCloseDayService],
})
export class StockOutModule {}
