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
import { UserConstants, UserMetadata } from './constants';

@ApiTags(UserMetadata.TAGS.USER)
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserMetadata.OPERATION.SUMMARY.CREATE_USER,
    description: UserMetadata.OPERATION.DESCRIPTION.CREATE_USER,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: UserMetadata.RESPONSES.CREATE_USER_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: UserMetadata.RESPONSES.INVALID_INPUT_DATA,
  })
  @ApiResponse({
    status: 401,
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
  })
  @ApiBody({ type: CreateUserDto })
  async create(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto);
  }

  @Get()
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserMetadata.OPERATION.SUMMARY.GET_ALL_USERS,
    description: UserMetadata.OPERATION.DESCRIPTION.GET_ALL_USERS,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: UserMetadata.RESPONSES.GET_ALL_USERS_SUCCESS,
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
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
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
    summary: UserMetadata.OPERATION.SUMMARY.GET_USER_BY_ID,
    description: UserMetadata.OPERATION.DESCRIPTION.GET_USER_BY_ID,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserMetadata.PARAMETERS.USER_ID,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: UserMetadata.RESPONSES.GET_USER_BY_ID_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserMetadata.RESPONSES.USER_NOT_FOUND,
  })
  async findById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    return await this.userService.getById(userId);
  }

  @Get('email/:email')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserMetadata.OPERATION.SUMMARY.GET_USER_BY_EMAIL,
    description: UserMetadata.OPERATION.DESCRIPTION.GET_USER_BY_EMAIL,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'email',
    description: UserMetadata.PARAMETERS.USER_EMAIL,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: UserMetadata.RESPONSES.GET_USER_BY_EMAIL_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 401,
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserMetadata.RESPONSES.USER_NOT_FOUND,
  })
  async findByEmail(@Param('email') email: string) {
    return await this.userService.getByEmail(email);
  }

  @Put(':id')
  @Roles(RoleNames.ADMIN, RoleNames.MANAGER)
  @ApiOperation({
    summary: UserMetadata.OPERATION.SUMMARY.UPDATE_USER,
    description: UserMetadata.OPERATION.DESCRIPTION.UPDATE_USER,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserMetadata.PARAMETERS.USER_ID,
    type: Number,
  })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: UserMetadata.RESPONSES.UPDATE_USER_SUCCESS,
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: UserMetadata.RESPONSES.INVALID_INPUT_DATA,
  })
  @ApiResponse({
    status: 401,
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserMetadata.RESPONSES.USER_NOT_FOUND,
  })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const userId = parseInt(id, 10);
    return await this.userService.update(userId, dto);
  }

  @Delete(':id')
  @Roles(RoleNames.ADMIN)
  @ApiOperation({
    summary: UserMetadata.OPERATION.SUMMARY.DELETE_USER,
    description: UserMetadata.OPERATION.DESCRIPTION.DELETE_USER,
  })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: UserMetadata.PARAMETERS.USER_ID,
    type: Number,
  })
  @ApiQuery({
    name: 'hard',
    description: UserMetadata.PARAMETERS.HARD_DELETE,
    required: false,
    type: Boolean,
  })
  @ApiResponse({
    status: 200,
    description: UserMetadata.RESPONSES.DELETE_USER_SUCCESS,
  })
  @ApiResponse({
    status: 401,
    description: UserMetadata.RESPONSES.UNAUTHORIZED_ACCESS,
  })
  @ApiResponse({
    status: 403,
    description: UserMetadata.RESPONSES.FORBIDDEN_ACCESS,
  })
  @ApiResponse({
    status: 404,
    description: UserMetadata.RESPONSES.USER_NOT_FOUND,
  })
  async delete(@Param('id') id: string, @Query('hard') hardDelete: string) {
    const userId = parseInt(id, 10);
    const hard = hardDelete === 'true';
    return await this.userService.delete(userId, hard);
  }
}
