import { ApiProperty } from '@nestjs/swagger';
import { Role, Status, User as PrismaUser } from 'generated/prisma';
import { UserConstants } from '../constants/user.constants';

export class UserEntity implements PrismaUser {
  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.ID,
    description: UserConstants.FIELDS.DESCRIPTIONS.ID,
  })
  id: number;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.PUBLIC_ID,
    description: UserConstants.FIELDS.DESCRIPTIONS.PUBLIC_ID,
  })
  publicId: string;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.EMAIL,
    description: UserConstants.FIELDS.DESCRIPTIONS.EMAIL,
  })
  email: string;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.FULL_NAME,
    description: UserConstants.FIELDS.DESCRIPTIONS.FULL_NAME,
    nullable: true,
  })
  fullName: string | null;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.PHONE,
    description: UserConstants.FIELDS.DESCRIPTIONS.PHONE,
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.STAFF,
    description: UserConstants.FIELDS.DESCRIPTIONS.ROLE,
  })
  role: Role;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.AVATAR,
    description: UserConstants.FIELDS.DESCRIPTIONS.AVATAR,
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    enum: Status,
    example: Status.ACTIVE,
    description: UserConstants.FIELDS.DESCRIPTIONS.STATUS,
  })
  status: Status;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.DATE,
    description: UserConstants.FIELDS.DESCRIPTIONS.LAST_LOGIN_AT,
    nullable: true,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.DATE,
    description: UserConstants.FIELDS.DESCRIPTIONS.LAST_OTP_SENT_AT,
    nullable: true,
  })
  lastOtpSentAt: Date | null;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.DATE,
    description: UserConstants.FIELDS.DESCRIPTIONS.FAILED_LOGIN_AT,
    nullable: true,
  })
  failedLoginAt: Date | null;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.DATE,
    description: UserConstants.FIELDS.DESCRIPTIONS.CREATED_AT,
  })
  createdAt: Date;

  @ApiProperty({
    example: UserConstants.FIELDS.EXAMPLES.DATE,
    description: UserConstants.FIELDS.DESCRIPTIONS.UPDATED_AT,
  })
  updatedAt: Date;

  // 👇 Liên kết với EmailOtp
  emailOtps: any[]; // bạn có thể map sang EmailOtpEntity nếu muốn tách rõ

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
