import { ApiProperty } from '@nestjs/swagger';
import { Role, Status, User as PrismaUser } from 'generated/prisma';

export class UserEntity implements PrismaUser {
  @ApiProperty({ example: 1, description: 'ID nội bộ của người dùng' })
  id: number;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID công khai của người dùng (UUID)',
  })
  publicId: string;

  @ApiProperty({
    example: 'nguoidung@example.com',
    description: 'Địa chỉ email của người dùng',
  })
  email: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Họ và tên của người dùng',
    nullable: true,
  })
  fullName: string | null;

  @ApiProperty({
    example: '0123456789',
    description: 'Số điện thoại của người dùng',
    nullable: true,
  })
  phone: string | null;

  @ApiProperty({
    enum: Role,
    example: Role.STAFF,
    description: 'Vai trò của người dùng',
  })
  role: Role;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'URL ảnh đại diện',
    nullable: true,
  })
  avatar: string | null;

  @ApiProperty({
    enum: Status,
    example: Status.ACTIVE,
    description: 'Trạng thái của người dùng',
  })
  status: Status;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian đăng nhập lần cuối',
    nullable: true,
  })
  lastLoginAt: Date | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian gửi OTP lần cuối',
    nullable: true,
  })
  lastOtpSentAt: Date | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian đăng nhập thất bại lần cuối',
    nullable: true,
  })
  failedLoginAt: Date | null;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian tạo bản ghi',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Thời gian cập nhật bản ghi',
  })
  updatedAt: Date;

  // 👇 Liên kết với EmailOtp
  emailOtps: any[]; // bạn có thể map sang EmailOtpEntity nếu muốn tách rõ

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
