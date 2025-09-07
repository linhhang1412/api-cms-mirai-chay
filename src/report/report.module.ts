import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SystemSettingModule } from '../system-setting/system-setting.module';

@Module({
  imports: [SystemSettingModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
