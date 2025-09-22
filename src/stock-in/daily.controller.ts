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
  ) { }

  @Post('dailies')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Tạo phiếu nhập trong ngày (header)' })
  createDaily(@Body() dto: CreateStockInDailyDto) {
    return this.dailyService.create(dto);
  }

  @Get('dailies/:id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lấy phiếu nhập theo id' })
  @ApiParam({ name: 'id', type: String })
  getDaily(@Param('id') id: string) {
    return this.dailyService.get(id);
  }

  @Get('dailies')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Danh sách phiếu nhập trong ngày' })
  listToday() {
    console.log("listToday called");

    return this.dailyService.listToday();
  }

  @Patch('dailies/:id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật header (chỉ trong ngày)' })
  updateDaily(@Param('id') id: string, @Body() dto: UpdateStockInDailyDto) {
    return this.dailyService.update(id, dto);
  }

  @Delete('dailies/:id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa header (chỉ trong ngày)' })
  deleteDaily(@Param('id') id: string) {
    return this.dailyService.delete(id);
  }
}
