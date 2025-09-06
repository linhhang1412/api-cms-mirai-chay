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
import {
  UserFieldDescriptions,
  UserFieldExamples,
} from '../constants/fields.constants';

export class CreateUserDto {
  @ApiProperty({
    description: UserFieldDescriptions.EMAIL,
    example: UserFieldExamples.EMAIL,
  })
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.FULL_NAME,
    example: UserFieldExamples.FULL_NAME,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  fullName?: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.PHONE,
    example: UserFieldExamples.PHONE,
    required: false,
  })
  @IsPhoneNumber('VN') // Vietnam phone number validation
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.ROLE,
    enum: Role,
    example: Role.STAFF,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.STAFF;

  @ApiPropertyOptional({
    description: UserFieldDescriptions.STATUS,
    enum: Status,
    example: Status.ACTIVE,
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status = Status.ACTIVE;
}
