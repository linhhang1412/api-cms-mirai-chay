import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
    @ApiProperty({ 
        description: 'Địa chỉ email của người dùng', 
        example: 'nguoidung@example.com' 
    })
    @IsEmail()
    email: string;

    @ApiProperty({ 
        description: 'Mã OTP 6 chữ số', 
        example: '123456',
        minLength: 6,
        maxLength: 6
    })
    @IsString()
    @Length(6, 6)
    code: string;
}
