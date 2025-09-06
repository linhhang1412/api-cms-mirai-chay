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
import { UserConstants } from '../constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.EMAIL,
    example: UserConstants.FIELDS.EXAMPLES.EMAIL,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.FULL_NAME,
    example: UserConstants.FIELDS.EXAMPLES.FULL_NAME,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.PHONE,
    example: UserConstants.FIELDS.EXAMPLES.PHONE,
  })
  @IsPhoneNumber('VN') // Vietnam phone number validation
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.ROLE,
    enum: Role,
    example: Role.MANAGER,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.STATUS,
    enum: Status,
    example: Status.INACTIVE,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
