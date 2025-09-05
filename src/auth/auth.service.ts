import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailOtpService } from '../email-otp/email-otp.service';
import { UserRepository } from '../user/user.repository';
import { AuthErrorMessages, AuthSuccessMessages } from './auth.messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly otpService: EmailOtpService,
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async requestOtp(email: string) {
    // Kiểm tra user, nếu chưa có thì báo lỗi
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new BadRequestException(AuthErrorMessages.EMAIL_NOT_REGISTERED);
    }

    const otp = await this.otpService.generateOtp(email, user.id);
    return { message: AuthSuccessMessages.OTP_SENT, expiresAt: otp.expiresAt };
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.otpService.verifyOtp(email, code);
    if (!otp) {
      throw new UnauthorizedException(AuthErrorMessages.OTP_INVALID_OR_EXPIRED);
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AuthErrorMessages.USER_NOT_FOUND);
    }

    const payload = { sub: user.publicId, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      // Kiểm tra payload có chứa email không
      if (!payload || !payload.email) {
        throw new UnauthorizedException(AuthErrorMessages.INVALID_REFRESH_TOKEN);
      }

      const user = await this.userRepo.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException(AuthErrorMessages.USER_NOT_FOUND);
      }

      const newPayload = {
        sub: user.publicId,
        email: user.email,
        role: user.role,
      };
      const newAccessToken = await this.jwtService.signAsync(newPayload);

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException(AuthErrorMessages.INVALID_REFRESH_TOKEN);
    }
  }
}