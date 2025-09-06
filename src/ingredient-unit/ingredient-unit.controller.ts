import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngredientUnitService } from './ingredient-unit.service';
import { CreateIngredientUnitDto } from './dto/create-ingredient-unit.dto';
import { UpdateIngredientUnitDto } from './dto/update-ingredient-unit.dto';
import { IngredientUnitEntity } from './entities/ingredient-unit.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { IngredientUnitMetadata } from './constants';

@ApiTags(IngredientUnitMetadata.TAGS.UNIT)
@Controller('ingredient-units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngredientUnitController {
  constructor(private readonly service: IngredientUnitService) {}

  @Post()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: IngredientUnitMetadata.OPERATION.SUMMARY.CREATE, description: IngredientUnitMetadata.OPERATION.DESCRIPTION.CREATE })
  @ApiBearerAuth()
  @ApiBody({ type: CreateIngredientUnitDto })
  @ApiResponse({ status: 201, description: IngredientUnitMetadata.RESPONSES.CREATE_SUCCESS, type: IngredientUnitEntity })
  async create(@Body() dto: CreateIngredientUnitDto) {
    return await this.service.create(dto);
  }

  @Get()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: IngredientUnitMetadata.OPERATION.SUMMARY.LIST, description: IngredientUnitMetadata.OPERATION.DESCRIPTION.LIST })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: IngredientUnitMetadata.PARAMETERS.PAGE })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: IngredientUnitMetadata.PARAMETERS.LIMIT })
  @ApiQuery({ name: 'search', required: false, type: String, description: IngredientUnitMetadata.PARAMETERS.SEARCH })
  @ApiResponse({ status: 200, description: IngredientUnitMetadata.RESPONSES.LIST_SUCCESS, schema: { type: 'object', properties: { items: { type: 'array', items: { $ref: '#/components/schemas/IngredientUnitEntity' } }, total: { type: 'number' }, page: { type: 'number' }, limit: { type: 'number' } } } })
  async list(@Query('page', new ParseIntPipe({ optional: true })) page?: number, @Query('limit', new ParseIntPipe({ optional: true })) limit?: number, @Query('search') search?: string) {
    return await this.service.list(page || 1, limit || 10, search);
  }

  @Get(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: IngredientUnitMetadata.OPERATION.SUMMARY.GET_BY_ID, description: IngredientUnitMetadata.OPERATION.DESCRIPTION.GET_BY_ID })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientUnitMetadata.PARAMETERS.ID, type: Number })
  @ApiResponse({ status: 200, description: IngredientUnitMetadata.RESPONSES.GET_SUCCESS, type: IngredientUnitEntity })
  async getById(@Param('id') id: string) {
    return await this.service.getById(parseInt(id, 10));
  }

  @Put(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: IngredientUnitMetadata.OPERATION.SUMMARY.UPDATE, description: IngredientUnitMetadata.OPERATION.DESCRIPTION.UPDATE })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientUnitMetadata.PARAMETERS.ID, type: Number })
  @ApiBody({ type: UpdateIngredientUnitDto })
  @ApiResponse({ status: 200, description: IngredientUnitMetadata.RESPONSES.UPDATE_SUCCESS, type: IngredientUnitEntity })
  async update(@Param('id') id: string, @Body() dto: UpdateIngredientUnitDto) {
    return await this.service.update(parseInt(id, 10), dto);
  }

  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: IngredientUnitMetadata.OPERATION.SUMMARY.DELETE, description: IngredientUnitMetadata.OPERATION.DESCRIPTION.DELETE })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientUnitMetadata.PARAMETERS.ID, type: Number })
  @ApiQuery({ name: 'hard', description: IngredientUnitMetadata.PARAMETERS.HARD_DELETE, required: false, type: Boolean })
  @ApiResponse({ status: 200, description: IngredientUnitMetadata.RESPONSES.DELETE_SUCCESS })
  async delete(@Param('id') id: string, @Query('hard') hard: string) {
    return await this.service.delete(parseInt(id, 10), hard === 'true');
  }
}

