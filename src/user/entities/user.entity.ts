import { ApiProperty } from '@nestjs/swagger';
import { Role, Status, User as PrismaUser } from 'generated/prisma';
import {
  UserFieldDescriptions,
  UserFieldExamples,
  UserFieldExamples as Examples,
} from '../constants/fields.constants';

export class UserEntity implements PrismaUser {
  @ApiProperty({
    example: Examples.ID,
    description: UserFieldDescriptions.ID,
  })
  id: number;

  @ApiProperty({
    example: Examples.PUBLIC_ID,
    description: UserFieldDescriptions.PUBLIC_ID,
  })
  publicId: string;

  @ApiProperty({
    example: Examples.EMAIL,
    description: UserFieldDescriptions.EMAIL,
  })
  email: string;

  @ApiProperty({
    example: Examples.FULL_NAME,
    description: UserFieldDescriptions.FULL_NAME,
    nullable: true,
  })
  fullName: string | null;

  @ApiProperty({
    example: Examples.PHONE,
    description: UserFieldDescriptions.PHONE,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.STAFF,
    description: UserFieldDescriptions.ROLE,
  })
  role: Role;

  @ApiProperty({
    example: Examples.AVATAR,
    description: UserFieldDescriptions.AVATAR,
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    enum: Status,
    example: Status.ACTIVE,
    description: UserFieldDescriptions.STATUS,
  })
  status: Status;

  @ApiProperty({
    example: Examples.DATE,
    description: UserFieldDescriptions.LAST_LOGIN_AT,
    nullable: true,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    example: Examples.DATE,
    description: UserFieldDescriptions.LAST_OTP_SENT_AT,
    nullable: true,
  })
  lastOtpSentAt: Date | null;

  @ApiProperty({
    example: Examples.DATE,
    description: UserFieldDescriptions.FAILED_LOGIN_AT,
    nullable: true,
  })
  failedLoginAt: Date | null;

  @ApiProperty({
    example: Examples.DATE,
    description: UserFieldDescriptions.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    example: Examples.DATE,
    description: UserFieldDescriptions.UPDATED_AT,
  })
  updatedAt: Date;

  // 👇 Liên kết với EmailOtp
  emailOtps: any[]; // bạn có thể map sang EmailOtpEntity nếu muốn tách rõ

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
