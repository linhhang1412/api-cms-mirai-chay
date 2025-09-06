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
import {
  AuthMessages,
  AuthMetadata,
  RoleNames,
  AuthApiTags,
  AuthConfig,
} from './constants';

@ApiTags(AuthApiTags.AUTH)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @Throttle({
    default: {
      limit: AuthConfig.RATE_LIMIT.REQUEST_OTP.MAX_REQUESTS,
      ttl: AuthConfig.RATE_LIMIT.REQUEST_OTP.TIME_WINDOW_MS,
    },
  })
  @ApiOperation({
    summary: AuthMetadata.OPERATION.SUMMARY.REQUEST_OTP,
    description: AuthMetadata.OPERATION.DESCRIPTION.REQUEST_OTP,
  })
  @ApiResponse({
    status: 200,
    description: AuthMessages.RESPONSE.OTP_EMAIL_SENT,
  })
  @ApiResponse({
    status: 400,
    description: AuthMessages.ERROR.EMAIL_NOT_REGISTERED,
  })
  @ApiResponse({
    status: 400,
    description: AuthMessages.RESPONSE.INVALID_EMAIL_FORMAT,
  })
  @ApiBody({ type: RequestOtpDto })
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto.email);
  }

  @Post('verify-otp')
  @Throttle({
    default: {
      limit: AuthConfig.RATE_LIMIT.VERIFY_OTP.MAX_REQUESTS,
      ttl: AuthConfig.RATE_LIMIT.VERIFY_OTP.TIME_WINDOW_MS,
    },
  })
  @ApiOperation({
    summary: AuthMetadata.OPERATION.SUMMARY.VERIFY_OTP,
    description: AuthMetadata.OPERATION.DESCRIPTION.VERIFY_OTP,
  })
  @ApiResponse({
    status: 200,
    description: AuthMessages.RESPONSE.OPERATION_SUCCESSFUL,
  })
  @ApiResponse({
    status: 401,
    description: AuthMessages.ERROR.OTP_INVALID_OR_EXPIRED,
  })
  @ApiBody({ type: VerifyOtpDto })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.email, dto.code);
  }

  @Post('refresh')
  @ApiOperation({
    summary: AuthMetadata.OPERATION.SUMMARY.REFRESH_TOKEN,
    description: AuthMetadata.OPERATION.DESCRIPTION.REFRESH_TOKEN,
  })
  @ApiResponse({
    status: 200,
    description: AuthMessages.SUCCESS.TOKEN_REFRESHED_SUCCESSFULLY,
  })
  @ApiResponse({
    status: 401,
    description: AuthMessages.ERROR.TOKEN_REFRESH_INVALID,
  })
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: AuthMetadata.OPERATION.SUMMARY.USER_LOGOUT,
    description: AuthMetadata.OPERATION.DESCRIPTION.USER_LOGOUT,
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: AuthMessages.SUCCESS.USER_LOGGED_OUT_SUCCESSFULLY,
  })
  @ApiResponse({
    status: 401,
    description: AuthMessages.ERROR.UNAUTHORIZED_ACCESS,
  })
  logout() {
    // Trong hệ thống JWT stateless, logout thường chỉ trả về thông báo
    // Trong hệ thống production, có thể implement blacklist token
    return { message: AuthMessages.SUCCESS.USER_LOGGED_OUT_SUCCESSFULLY };
  }
}
