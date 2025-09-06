import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { AuthFieldDescriptions, AuthFieldExamples } from '../constants';
import { AuthConfig } from '../constants';

export class VerifyOtpDto {
  @ApiProperty({
    description: AuthFieldDescriptions.EMAIL,
    example: AuthFieldExamples.EMAIL,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: AuthFieldDescriptions.OTP_CODE,
    example: AuthFieldExamples.OTP_CODE,
    minLength: AuthConfig.OTP.CODE_LENGTH,
    maxLength: AuthConfig.OTP.CODE_LENGTH,
  })
  @IsString()
  @Length(AuthConfig.OTP.CODE_LENGTH, AuthConfig.OTP.CODE_LENGTH)
  code: string;
}
