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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Người dùng')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách người dùng thành công',
    type: [UserEntity],
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async findById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = await this.userService.getById(userId);
    return user ? new UserEntity(user) : null;
  }

  @Get('email/:email')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo email' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'email',
    description: 'Email của người dùng',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin người dùng thành công',
    type: UserEntity,
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.getByEmail(email);
    return user ? new UserEntity(user) : null;
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng theo ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thông tin người dùng thành công',
    type: UserEntity,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const userId = parseInt(id, 10);
    const user = await this.userService.update(userId, dto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Xóa người dùng theo ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: Number })
  @ApiQuery({
    name: 'hard',
    description: 'Thực hiện xóa vĩnh viễn',
    required: false,
    type: Boolean,
  })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async delete(@Param('id') id: string, @Query('hard') hardDelete: string) {
    const userId = parseInt(id, 10);
    const hard = hardDelete === 'true';
    return this.userService.delete(userId, hard);
  }
}
