import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findAll() {
    return this.userService.getAll();
  }

  @Get(':email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.userService.getByEmail(email);
    return user ? new UserEntity(user) : null;
  }
}
