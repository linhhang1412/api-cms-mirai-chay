import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestOtpDto {
    @ApiProperty({ 
        description: 'Địa chỉ email của người dùng', 
        example: 'nguoidung@example.com' 
    })
    @IsEmail()
    email: string;
}
