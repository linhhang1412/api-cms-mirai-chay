import { Module } from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';

@Module({
  imports: [],
  controllers: [StockInController],
  providers: [StockInService],
  exports: [StockInService],
})
export class StockInModule {}

