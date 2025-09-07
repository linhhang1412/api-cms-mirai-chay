import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CloseDayJob } from './close-day.job';
import { CloseDayScheduler } from './close-day.scheduler';
import { StockInModule } from '../stock-in/stock-in.module';
import { StockOutModule } from '../stock-out/stock-out.module';
import { InventoryModule } from '../inventory/inventory.module';
import { SystemSettingModule } from '../system-setting/system-setting.module';
import { AdminSettingsController } from './admin-settings.controller';

@Module({
  imports: [ScheduleModule.forRoot(), StockInModule, StockOutModule, InventoryModule, SystemSettingModule],
  controllers: [AdminSettingsController],
  providers: [CloseDayJob, CloseDayScheduler],
})
export class JobsModule {}
