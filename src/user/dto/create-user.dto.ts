import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role, Status } from 'generated/prisma';

export class CreateUserDto {
    @ApiProperty({ 
        description: 'Địa chỉ email của người dùng', 
        example: 'nguoidung@example.com' 
    })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({ 
        description: 'Họ và tên của người dùng', 
        example: 'Nguyễn Văn A',
        required: false 
    })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiPropertyOptional({ 
        description: 'Số điện thoại của người dùng', 
        example: '0123456789',
        required: false 
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ 
        description: 'Vai trò của người dùng', 
        enum: Role,
        example: Role.STAFF,
        required: false 
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.STAFF;

    @ApiPropertyOptional({ 
        description: 'Trạng thái của người dùng', 
        enum: Status,
        example: Status.ACTIVE,
        required: false 
    })
    @IsEnum(Status)
    @IsOptional()
    status?: Status = Status.ACTIVE;
}
