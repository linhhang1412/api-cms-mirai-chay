import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
    async requestOtp(@Body() dto: RequestOtpDto) {
        return this.authService.requestOtp(dto.email);
    }

    @Post('verify-otp')
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto.email, dto.code);
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshAccessToken(refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout() {
        // Trong hệ thống JWT stateless, logout thường chỉ trả về thông báo
        // Trong hệ thống production, có thể implement blacklist token
        return { message: 'Logged out successfully' };
    }
}
