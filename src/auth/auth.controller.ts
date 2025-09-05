import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Xác thực')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @ApiOperation({ summary: 'Yêu cầu mã OTP để đăng nhập' })
  @ApiResponse({ status: 200, description: 'Mã OTP đã được gửi thành công' })
  @ApiResponse({
    status: 400,
    description: 'Email chưa được đăng ký trong hệ thống',
  })
  @ApiResponse({ status: 400, description: 'Định dạng email không hợp lệ' })
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.email);
  }

  @Post('verify-otp')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Xác thực mã OTP và nhận token truy cập' })
  @ApiResponse({ status: 200, description: 'Xác thực thành công' })
  @ApiResponse({
    status: 401,
    description: 'Mã OTP không hợp lệ hoặc đã hết hạn',
  })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới token truy cập' })
  @ApiResponse({ status: 200, description: 'Token đã được làm mới thành công' })
  @ApiResponse({ status: 401, description: 'Token làm mới không hợp lệ' })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đăng xuất người dùng' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  logout() {
    // Trong hệ thống JWT stateless, logout thường chỉ trả về thông báo
    // Trong hệ thống production, có thể implement blacklist token
    return { message: 'Đăng xuất thành công' };
  }
}
