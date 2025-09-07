import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SystemSettingService } from '../system-setting/system-setting.service';
import { CloseDayScheduler } from './close-day.scheduler';
import { UpdateLowStockThresholdDto } from './dto/update-threshold.dto';
import { UpdateCloseDayConfigDto } from './dto/update-close-day.dto';

@ApiTags('Admin Settings')
@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminSettingsController {
  constructor(
    private readonly settings: SystemSettingService,
    private readonly scheduler: CloseDayScheduler,
  ) {}

  @Get()
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Xem cấu hình liên quan đến tồn kho/chốt ngày' })
  async getAll() {
    const [threshold, cron, timezone] = await Promise.all([
      this.settings.getString('default_low_stock_threshold'),
      this.settings.getString('close_day_cron'),
      this.settings.getString('close_day_timezone'),
    ]);
    return { default_low_stock_threshold: threshold, close_day_cron: cron, close_day_timezone: timezone };
  }

  @Patch('low-stock-threshold')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Cập nhật ngưỡng cảnh báo sắp hết mặc định' })
  async updateLowStockThreshold(@Body() dto: UpdateLowStockThresholdDto) {
    await this.settings.setString('default_low_stock_threshold', String(dto.value));
    return { default_low_stock_threshold: dto.value };
  }

  @Patch('close-day')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: 'Cập nhật cron/timezone của job chốt ngày và reload lịch' })
  async updateCloseDay(@Body() dto: UpdateCloseDayConfigDto) {
    await this.settings.setString('close_day_cron', dto.cron);
    if (dto.timezone) await this.settings.setString('close_day_timezone', dto.timezone);
    await this.scheduler.reload();
    return { close_day_cron: dto.cron, close_day_timezone: dto.timezone };
  }
}

