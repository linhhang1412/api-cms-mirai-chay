import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngredientCategoryService } from './ingredient-category.service';
import { CreateIngredientCategoryDto } from './dto/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from './dto/update-ingredient-category.dto';
import { IngredientCategoryEntity } from './entities/ingredient-category.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { IngredientCategoryMetadata } from './constants';

@ApiTags(IngredientCategoryMetadata.TAGS.CATEGORY)
@Controller('ingredient-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngredientCategoryController {
  constructor(private readonly service: IngredientCategoryService) {}

  @Post()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: IngredientCategoryMetadata.OPERATION.SUMMARY.CREATE, description: IngredientCategoryMetadata.OPERATION.DESCRIPTION.CREATE })
  @ApiBearerAuth()
  @ApiBody({ type: CreateIngredientCategoryDto })
  @ApiResponse({ status: 201, description: IngredientCategoryMetadata.RESPONSES.CREATE_SUCCESS, type: IngredientCategoryEntity })
  async create(@Body() dto: CreateIngredientCategoryDto) {
    return await this.service.create(dto);
  }

  @Get()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({ summary: IngredientCategoryMetadata.OPERATION.SUMMARY.LIST, description: IngredientCategoryMetadata.OPERATION.DESCRIPTION.LIST })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: IngredientCategoryMetadata.RESPONSES.LIST_SUCCESS, type: IngredientCategoryEntity, isArray: true })
  async list() {
    return await this.service.list();
  }

  @Put(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({ summary: IngredientCategoryMetadata.OPERATION.SUMMARY.UPDATE, description: IngredientCategoryMetadata.OPERATION.DESCRIPTION.UPDATE })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientCategoryMetadata.PARAMETERS.ID, type: Number })
  @ApiBody({ type: UpdateIngredientCategoryDto })
  @ApiResponse({ status: 200, description: IngredientCategoryMetadata.RESPONSES.UPDATE_SUCCESS, type: IngredientCategoryEntity })
  async update(@Param('id') id: string, @Body() dto: UpdateIngredientCategoryDto) {
    return await this.service.update(parseInt(id, 10), dto);
  }

  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({ summary: IngredientCategoryMetadata.OPERATION.SUMMARY.DELETE, description: IngredientCategoryMetadata.OPERATION.DESCRIPTION.DELETE })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientCategoryMetadata.PARAMETERS.ID, type: Number })
  @ApiQuery({ name: 'hard', description: IngredientCategoryMetadata.PARAMETERS.HARD_DELETE, required: false, type: Boolean })
  @ApiResponse({ status: 200, description: IngredientCategoryMetadata.RESPONSES.DELETE_SUCCESS })
  async delete(@Param('id') id: string, @Query('hard') hard: string) {
    return await this.service.delete(parseInt(id, 10), hard === 'true');
  }
}

