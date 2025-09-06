import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientEntity } from './entities/ingredient.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import { IngredientConstants, IngredientMetadata } from './constants';

@ApiTags(IngredientConstants.API.TAGS.INGREDIENT)
@Controller('ingredients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: IngredientMetadata.OPERATION.SUMMARY.CREATE,
    description: IngredientMetadata.OPERATION.DESCRIPTION.CREATE,
  })
  @ApiBearerAuth()
  @ApiBody({ type: CreateIngredientDto })
  @ApiResponse({ status: 201, description: IngredientMetadata.RESPONSES.CREATE_SUCCESS, type: IngredientEntity })
  @ApiResponse({ status: 400, description: IngredientMetadata.RESPONSES.INVALID_INPUT_DATA })
  @ApiResponse({ status: 401, description: IngredientMetadata.RESPONSES.UNAUTHORIZED_ACCESS })
  @ApiResponse({ status: 403, description: IngredientMetadata.RESPONSES.FORBIDDEN_ACCESS })
  async create(@Body() dto: CreateIngredientDto) {
    return await this.ingredientService.create(dto);
  }

  @Get()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({
    summary: IngredientMetadata.OPERATION.SUMMARY.LIST,
    description: IngredientMetadata.OPERATION.DESCRIPTION.LIST,
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number, description: IngredientMetadata.PARAMETERS.PAGE })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: IngredientMetadata.PARAMETERS.LIMIT })
  @ApiQuery({ name: 'search', required: false, type: String, description: IngredientMetadata.PARAMETERS.SEARCH })
  @ApiResponse({
    status: 200,
    description: IngredientMetadata.RESPONSES.LIST_SUCCESS,
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: '#/components/schemas/IngredientEntity' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
      },
    },
  })
  async list(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('search') search?: string,
  ) {
    return await this.ingredientService.getAll(page || 1, limit || 10, search);
  }

  @Get(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({
    summary: IngredientMetadata.OPERATION.SUMMARY.GET_BY_ID,
    description: IngredientMetadata.OPERATION.DESCRIPTION.GET_BY_ID,
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientMetadata.PARAMETERS.ID, type: Number })
  @ApiResponse({ status: 200, description: IngredientMetadata.RESPONSES.GET_SUCCESS, type: IngredientEntity })
  @ApiResponse({ status: 404, description: IngredientMetadata.RESPONSES.NOT_FOUND })
  async getById(@Param('id') id: string) {
    const ingredientId = parseInt(id, 10);
    return await this.ingredientService.getById(ingredientId);
  }

  @Put(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: IngredientMetadata.OPERATION.SUMMARY.UPDATE,
    description: IngredientMetadata.OPERATION.DESCRIPTION.UPDATE,
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientMetadata.PARAMETERS.ID, type: Number })
  @ApiBody({ type: UpdateIngredientDto })
  @ApiResponse({ status: 200, description: IngredientMetadata.RESPONSES.UPDATE_SUCCESS, type: IngredientEntity })
  async update(@Param('id') id: string, @Body() dto: UpdateIngredientDto) {
    const ingredientId = parseInt(id, 10);
    return await this.ingredientService.update(ingredientId, dto);
  }

  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({
    summary: IngredientMetadata.OPERATION.SUMMARY.DELETE,
    description: IngredientMetadata.OPERATION.DESCRIPTION.DELETE,
  })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: IngredientMetadata.PARAMETERS.ID, type: Number })
  @ApiQuery({ name: 'hard', description: IngredientMetadata.PARAMETERS.HARD_DELETE, required: false, type: Boolean })
  @ApiResponse({ status: 200, description: IngredientMetadata.RESPONSES.DELETE_SUCCESS })
  async delete(@Param('id') id: string, @Query('hard') hardDelete: string) {
    const ingredientId = parseInt(id, 10);
    const hard = hardDelete === 'true';
    return await this.ingredientService.delete(ingredientId, hard);
  }
}

