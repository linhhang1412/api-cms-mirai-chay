import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AuthFieldDescriptions, AuthFieldExamples } from '../constants';

export class RequestOtpDto {
  @ApiProperty({
    description: AuthFieldDescriptions.EMAIL,
    example: AuthFieldExamples.EMAIL,
  })
  @IsEmail()
  email: string;
}
