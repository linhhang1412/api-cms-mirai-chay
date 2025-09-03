import { Body, Controller, Post } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';

@Controller('otp')
export class EmailOtpController {
    constructor(private readonly otpService: EmailOtpService) { }

    @Post('request')
    async requestOtp(@Body('email') email: string) {
        const otp = await this.otpService.generateOtp(email);
        return { message: 'OTP đã được gửi đến email', email, expiresAt: otp.expiresAt };
    }

    @Post('verify')
    async verifyOtp(@Body('email') email: string, @Body('code') code: string) {
        const otp = await this.otpService.verifyOtp(email, code);
        return { message: 'Xác thực OTP thành công', email: otp.email };
    }
}
