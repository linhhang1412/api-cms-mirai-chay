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
  ApiBearerAuth 
} from '@nestjs/swagger';
import { 
  AuthErrorMessages, 
  AuthSuccessMessages, 
  AuthOperationSummaries,
  AuthOperationDescriptions,
  AuthResponseDescriptions,
  AuthApiTags,
  AuthRateLimits
} from './auth.messages';

@ApiTags(AuthApiTags.AUTH)
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('request-otp')
    @Throttle({ default: AuthRateLimits.REQUEST_OTP })
    @ApiOperation({ 
      summary: AuthOperationSummaries.REQUEST_OTP,
      description: AuthOperationDescriptions.REQUEST_OTP
    })
    @ApiResponse({ status: 200, description: AuthResponseDescriptions.OTP_SENT })
    @ApiResponse({ status: 400, description: AuthResponseDescriptions.EMAIL_NOT_REGISTERED })
    @ApiResponse({ status: 400, description: AuthResponseDescriptions.INVALID_EMAIL_FORMAT })
    @ApiBody({ type: RequestOtpDto })
    async requestOtp(@Body() dto: RequestOtpDto) {
        return this.authService.requestOtp(dto.email);
    }

    @Post('verify-otp')
    @Throttle({ default: AuthRateLimits.VERIFY_OTP })
    @ApiOperation({ 
      summary: AuthOperationSummaries.VERIFY_OTP,
      description: AuthOperationDescriptions.VERIFY_OTP
    })
    @ApiResponse({ status: 200, description: AuthResponseDescriptions.SUCCESS })
    @ApiResponse({ status: 401, description: AuthResponseDescriptions.OTP_INVALID_OR_EXPIRED })
    @ApiBody({ type: VerifyOtpDto })
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto.email, dto.code);
    }

    @Post('refresh')
    @ApiOperation({ 
      summary: AuthOperationSummaries.REFRESH_TOKEN,
      description: AuthOperationDescriptions.REFRESH_TOKEN
    })
    @ApiResponse({ status: 200, description: AuthResponseDescriptions.TOKEN_REFRESHED })
    @ApiResponse({ status: 401, description: AuthResponseDescriptions.INVALID_REFRESH_TOKEN })
    async refresh(@Body('refreshToken') refreshToken: string) {
        return this.authService.refreshAccessToken(refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ 
      summary: AuthOperationSummaries.LOGOUT,
      description: AuthOperationDescriptions.LOGOUT
    })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: AuthResponseDescriptions.LOGOUT_SUCCESS })
    @ApiResponse({ status: 401, description: AuthResponseDescriptions.UNAUTHORIZED })
    logout() {
        // Trong hệ thống JWT stateless, logout thường chỉ trả về thông báo
        // Trong hệ thống production, có thể implement blacklist token
        return { message: AuthSuccessMessages.LOGOUT_SUCCESS };
    }
}
