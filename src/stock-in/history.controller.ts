import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateStockInDailyDto } from './dto/create-daily.dto';
import { AddStockInItemDto } from './dto/add-item.dto';
import { UpdateStockInItemDto } from './dto/update-item.dto';
import { UpdateStockInDailyDto } from './dto/update-daily.dto';
import { StockInDailyService } from './services/daily.service';
import { StockInItemService } from './services/item.service';

@ApiTags('Stock In')
@Controller('stock-in')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockInController {
  constructor(
    private readonly dailyService: StockInDailyService,
    private readonly itemService: StockInItemService,
  ) { }

  @Get('history')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lịch sử phiếu nhập (ngoài hôm nay)' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'YYYY-MM-DD' })
  listHistory(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dailyService.listHistory(from, to);
  }

}
