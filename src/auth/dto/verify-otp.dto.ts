import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { AuthDtoDescriptions, AuthDtoExamples, AuthOtpConfig } from '../auth.messages';

export class VerifyOtpDto {
    @ApiProperty({ 
        description: AuthDtoDescriptions.EMAIL,
        example: AuthDtoExamples.EMAIL
    })
    @IsEmail()
    email: string;

    @ApiProperty({ 
        description: AuthDtoDescriptions.OTP_CODE,
        example: AuthDtoExamples.OTP_CODE,
        minLength: AuthOtpConfig.LENGTH,
        maxLength: AuthOtpConfig.LENGTH
    })
    @IsString()
    @Length(AuthOtpConfig.LENGTH, AuthOtpConfig.LENGTH)
    code: string;
}
