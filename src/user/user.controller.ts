import { Body, Controller, Get, Param, Post, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @Roles('ADMIN', 'MANAGER')
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER')
  findAll() {
    return this.userService.getAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'STAFF')
  async findById(@Param('id') id: string) {
    const userId = parseInt(id, 10);
    const user = await this.userService.getById(userId);
    return user ? new UserEntity(user) : null;
  }

  @Get('email/:email')
  @Roles('ADMIN', 'MANAGER')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.getByEmail(email);
    return user ? new UserEntity(user) : null;
  }

  @Put(':id')
  @Roles('ADMIN', 'MANAGER')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const userId = parseInt(id, 10);
    const user = await this.userService.update(userId, dto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(
    @Param('id') id: string, 
    @Query('hard') hardDelete: string
  ) {
    const userId = parseInt(id, 10);
    const hard = hardDelete === 'true';
    return this.userService.delete(userId, hard);
  }
}
