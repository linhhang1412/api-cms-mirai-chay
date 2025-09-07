import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ReportService } from './report.service';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Get('ending')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Tồn cuối ngày theo nguyên liệu' })
  @ApiQuery({ name: 'date', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'categoryPublicId', type: String, required: false })
  ending(@Query('date') date: string, @Query('categoryPublicId') categoryPublicId?: string) {
    return this.service.endingByDate(date, categoryPublicId);
  }

  @Get('ledger/:ingredientPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Sổ kho 1 nguyên liệu theo ngày' })
  @ApiParam({ name: 'ingredientPublicId', type: String })
  @ApiQuery({ name: 'from', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', type: String, description: 'YYYY-MM-DD' })
  ledger(
    @Param('ingredientPublicId') ingredientPublicId: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.service.ledger(ingredientPublicId, from, to);
  }

  @Get('top-out')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Top nguyên liệu xuất nhiều nhất' })
  @ApiQuery({ name: 'from', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  topOut(@Query('from') from: string, @Query('to') to: string, @Query('limit') limit?: string) {
    return this.service.topOut(from, to, limit ? parseInt(limit, 10) : 10);
  }

  @Get('movement-summary')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Tổng hợp nhập/xuất theo ngày (toàn hệ thống)' })
  @ApiQuery({ name: 'from', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', type: String, description: 'YYYY-MM-DD' })
  movementSummary(@Query('from') from: string, @Query('to') to: string) {
    return this.service.movementSummary(from, to);
  }

  @Get('stock-alerts')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Cảnh báo nguyên liệu sắp hết / đã hết' })
  @ApiQuery({ name: 'date', type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'threshold', type: Number, required: false, description: 'Ngưỡng mặc định nếu ingredient.minStock trống' })
  @ApiQuery({ name: 'categoryCode', type: String, required: false })
  stockAlerts(
    @Query('date') date: string,
    @Query('threshold') threshold?: string,
    @Query('categoryCode') categoryCode?: string,
  ) {
    const th = threshold ? parseFloat(threshold) : 0;
    return this.service.stockAlerts(date, th, categoryCode);
  }
}
