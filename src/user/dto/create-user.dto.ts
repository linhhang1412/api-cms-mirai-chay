import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Role, Status } from 'generated/prisma';
import { UserConstants } from '../constants';

export class CreateUserDto {
  @ApiProperty({
    description: UserConstants.FIELDS.DESCRIPTIONS.EMAIL,
    example: UserConstants.FIELDS.EXAMPLES.EMAIL,
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.FULL_NAME,
    example: UserConstants.FIELDS.EXAMPLES.FULL_NAME,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.PHONE,
    example: UserConstants.FIELDS.EXAMPLES.PHONE,
    required: false,
  })
  @IsPhoneNumber('VN') // Vietnam phone number validation
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.ROLE,
    enum: Role,
    example: Role.STAFF,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.STAFF;

  @ApiPropertyOptional({
    description: UserConstants.FIELDS.DESCRIPTIONS.STATUS,
    enum: Status,
    example: Status.ACTIVE,
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;
}
