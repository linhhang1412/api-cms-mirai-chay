import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  ) {}

  @Post('dailies')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Tạo phiếu nhập trong ngày (header)' })
  createDaily(@Body() dto: CreateStockInDailyDto) {
    return this.dailyService.create(dto);
  }

  @Get('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lấy phiếu nhập theo publicId' })
  @ApiParam({ name: 'publicId', type: String })
  getDaily(@Param('publicId') publicId: string) {
    return this.dailyService.get(publicId);
  }

  @Post('dailies/:publicId/items')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Thêm dòng vào phiếu nhập' })
  addItem(@Param('publicId') dailyPublicId: string, @Body() dto: AddStockInItemDto) {
    return this.itemService.add(dailyPublicId, dto);
  }

  @Patch('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật header (chỉ trong ngày)' })
  updateDaily(@Param('publicId') publicId: string, @Body() dto: UpdateStockInDailyDto) {
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
  updateItem(@Param('itemPublicId') itemPublicId: string, @Body() dto: UpdateStockInItemDto) {
    return this.itemService.update(itemPublicId, dto);
  }

  @Delete('dailies/items/:itemPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa dòng (chỉ trong ngày)' })
  deleteItem(@Param('itemPublicId') itemPublicId: string) {
    return this.itemService.remove(itemPublicId);
  }
}

