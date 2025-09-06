import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Role, Status } from 'generated/prisma';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  UserFieldDescriptions,
  UserFieldExamples,
} from '../constants/fields.constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: UserFieldDescriptions.EMAIL,
    example: UserFieldExamples.EMAIL,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.FULL_NAME,
    example: UserFieldExamples.FULL_NAME,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.PHONE,
    example: UserFieldExamples.PHONE,
  })
  @IsPhoneNumber('VN') // Vietnam phone number validation
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.ROLE,
    enum: Role,
    example: Role.MANAGER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.STATUS,
    enum: Status,
    example: Status.INACTIVE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
