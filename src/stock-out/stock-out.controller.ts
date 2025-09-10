import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { StockOutDailyService } from './services/daily.service';
import { StockOutItemService } from './services/item.service';
import { CreateStockOutDailyDto } from './dto/create-daily.dto';
import { AddStockOutItemDto } from './dto/add-item.dto';
import { UpdateStockOutItemDto } from './dto/update-item.dto';
import { UpdateStockOutDailyDto } from './dto/update-daily.dto';

@ApiTags('Stock Out')
@Controller('stock-out')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockOutController {
  constructor(
    private readonly dailyService: StockOutDailyService,
    private readonly itemService: StockOutItemService,
  ) {}

  @Post('dailies')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Tạo phiếu xuất trong ngày (header)' })
  createDaily(@Body() dto: CreateStockOutDailyDto) {
    return this.dailyService.create(dto);
  }

  @Get('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lấy phiếu xuất theo publicId' })
  @ApiParam({ name: 'publicId', type: String })
  getDaily(@Param('publicId') publicId: string) {
    return this.dailyService.get(publicId);
  }

  @Get('dailies/today')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Danh sách phiếu xuất trong ngày' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listToday(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.dailyService.listToday(page || 1, limit || 10);
  }

  @Get('dailies/history')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lịch sử phiếu xuất (ngoài hôm nay)' })
  @ApiQuery({ name: 'from', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: false, type: String, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  listHistory(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.dailyService.listHistory(from, to, page || 1, limit || 10);
  }

  @Post('dailies/:publicId/items')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Thêm dòng vào phiếu xuất' })
  addItem(@Param('publicId') dailyPublicId: string, @Body() dto: AddStockOutItemDto) {
    return this.itemService.add(dailyPublicId, dto);
  }

  @Patch('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật header (chỉ trong ngày)' })
  updateDaily(@Param('publicId') publicId: string, @Body() dto: UpdateStockOutDailyDto) {
    return this.dailyService.update(publicId, dto);
  }

  @Delete('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa header (chỉ trong ngày)' })
  deleteDaily(@Param('publicId') publicId: string) {
    return this.dailyService.delete(publicId);
  }

  @Patch('dailies/items/:itemPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật dòng (chỉ trong ngày)' })
  updateItem(@Param('itemPublicId') itemPublicId: string, @Body() dto: UpdateStockOutItemDto) {
    return this.itemService.update(itemPublicId, dto);
  }

  @Delete('dailies/items/:itemPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa dòng (chỉ trong ngày)' })
  deleteItem(@Param('itemPublicId') itemPublicId: string) {
    return this.itemService.remove(itemPublicId);
  }
}
