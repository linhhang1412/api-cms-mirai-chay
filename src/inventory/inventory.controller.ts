import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { InventoryService } from './inventory.service';

@ApiTags('Inventory')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get('ending')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: 'Tồn cuối ngày theo nguyên liệu' })
  @ApiQuery({ name: 'ingredientPublicId', type: String })
  @ApiQuery({ name: 'date', type: String, required: false, description: 'YYYY-MM-DD, mặc định hôm nay' })
  ending(@Query('ingredientPublicId') ingredientPublicId: string, @Query('date') date?: string) {
    return this.service.endingByIngredient(ingredientPublicId, date);
  }
}

