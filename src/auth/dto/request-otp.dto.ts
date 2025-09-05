import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthDtoDescriptions, AuthDtoExamples } from '../auth.messages';

export class RequestOtpDto {
    @ApiProperty({ 
        description: AuthDtoDescriptions.EMAIL,
        example: AuthDtoExamples.EMAIL
    })
    @IsEmail()
    email: string;
}
