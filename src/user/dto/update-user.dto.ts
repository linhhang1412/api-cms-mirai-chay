import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, Status } from 'generated/prisma';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Địa chỉ email của người dùng',
    example: 'nguoidung@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Họ và tên của người dùng',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Số điện thoại của người dùng',
    example: '0123456789',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Vai trò của người dùng',
    enum: Role,
    example: Role.MANAGER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: 'Trạng thái của người dùng',
    enum: Status,
    example: Status.INACTIVE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
