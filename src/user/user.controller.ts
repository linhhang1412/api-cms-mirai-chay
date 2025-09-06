import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleNames } from '../auth/constants/roles.constants';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserApiTags } from './constants/api.constants';
import {
  UserOperationSummaries,
  UserOperationDescriptions,
} from './constants/metadata.constants';
import { UserResponseDescriptions } from './constants/responses.constants';
import { UserParameterDescriptions } from './constants/parameters.constants';

@ApiTags(UserApiTags.USER)
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserOperationSummaries.CREATE_USER,
    description: UserOperationDescriptions.CREATE_USER,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: UserResponseDescriptions.CREATE_USER_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: UserResponseDescriptions.INVALID_INPUT_DATA,
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserOperationSummaries.GET_ALL_USERS,
    description: UserOperationDescriptions.GET_ALL_USERS,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: UserResponseDescriptions.GET_ALL_USERS_SUCCESS,
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/UserEntity',
          },
        },
        total: {
          type: 'number',
        },
        page: {
          type: 'number',
        },
        limit: {
          type: 'number',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang (mặc định: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Số mục mỗi trang (mặc định: 10)',
  })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.userService.getAll(page || 1, limit || 10);
  }

  @Get(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER, RoleNames.STAFF)
  @ApiOperation({
    summary: UserOperationSummaries.GET_USER_BY_ID,
    description: UserOperationDescriptions.GET_USER_BY_ID,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserParameterDescriptions.USER_ID,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: UserResponseDescriptions.GET_USER_BY_ID_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserResponseDescriptions.USER_NOT_FOUND,
  })
  async findById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return await this.userService.getById(userId);
  }

  @Get('email/:email')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserOperationSummaries.GET_USER_BY_EMAIL,
    description: UserOperationDescriptions.GET_USER_BY_EMAIL,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'email',
    description: UserParameterDescriptions.USER_EMAIL,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: UserResponseDescriptions.GET_USER_BY_EMAIL_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserResponseDescriptions.USER_NOT_FOUND,
  })
  async findByEmail(@Param('email') email: string) {
    return await this.userService.getByEmail(email);
  }

  @Put(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserOperationSummaries.UPDATE_USER,
    description: UserOperationDescriptions.UPDATE_USER,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserParameterDescriptions.USER_ID,
    type: Number,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: UserResponseDescriptions.UPDATE_USER_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: UserResponseDescriptions.INVALID_INPUT_DATA,
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserResponseDescriptions.USER_NOT_FOUND,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const userId = parseInt(id, 10);
    return await this.userService.update(userId, dto);
  }

  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({
    summary: UserOperationSummaries.DELETE_USER,
    description: UserOperationDescriptions.DELETE_USER,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserParameterDescriptions.USER_ID,
    type: Number,
  })
  @ApiQuery({
    name: 'hard',
    description: UserParameterDescriptions.HARD_DELETE,
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: UserResponseDescriptions.DELETE_USER_SUCCESS,
  })
  @ApiResponse({
    status: 401,
    description: UserResponseDescriptions.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserResponseDescriptions.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserResponseDescriptions.USER_NOT_FOUND,
  })
  async delete(@Param('id') id: string, @Query('hard') hardDelete: string) {
    const userId = parseInt(id, 10);
    const hard = hardDelete === 'true';
    return await this.userService.delete(userId, hard);
  }
}
