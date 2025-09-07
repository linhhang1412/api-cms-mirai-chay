import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { StockOutService } from './stock-out.service';
import { CreateStockOutDailyDto } from './dto/create-daily.dto';
import { AddStockOutItemDto } from './dto/add-item.dto';
import { UpdateStockOutItemDto } from './dto/update-item.dto';
import { CloseOutDayDto } from './dto/close-day.dto';
import { UpdateStockOutDailyDto } from './dto/update-daily.dto';

@ApiTags('Stock Out')
@Controller('stock-out')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StockOutController {
  constructor(private readonly service: StockOutService) {}

  @Post('dailies')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Tạo phiếu xuất trong ngày (header)' })
  createDaily(@Body() dto: CreateStockOutDailyDto) {
    return this.service.createDaily(dto);
  }

  @Get('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Lấy phiếu xuất theo publicId' })
  @ApiParam({ name: 'publicId', type: String })
  getDaily(@Param('publicId') publicId: string) {
    return this.service.getDaily(publicId);
  }

  @Post('dailies/:publicId/items')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Thêm dòng vào phiếu xuất' })
  addItem(@Param('publicId') dailyPublicId: string, @Body() dto: AddStockOutItemDto) {
    return this.service.addItem(dailyPublicId, dto);
  }

  @Patch('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật header (chỉ trong ngày)' })
  updateDaily(@Param('publicId') publicId: string, @Body() dto: UpdateStockOutDailyDto) {
    return this.service.updateDaily(publicId, dto);
  }

  @Delete('dailies/:publicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa header (chỉ trong ngày)' })
  deleteDaily(@Param('publicId') publicId: string) {
    return this.service.deleteDaily(publicId);
  }

  @Patch('dailies/items/:itemPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Cập nhật dòng (chỉ trong ngày)' })
  updateItem(@Param('itemPublicId') itemPublicId: string, @Body() dto: UpdateStockOutItemDto) {
    return this.service.updateItem(itemPublicId, dto);
  }

  @Delete('dailies/items/:itemPublicId')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Xóa dòng (chỉ trong ngày)' })
  deleteItem(@Param('itemPublicId') itemPublicId: string) {
    return this.service.deleteItem(itemPublicId);
  }

  @Post('close-day')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: 'Chốt ngày (copy daily -> history, snapshot xuất)' })
  closeDay(@Body() dto: CloseOutDayDto) {
    return this.service.closeDay(dto);
  }
}
