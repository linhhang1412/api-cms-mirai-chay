import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailOtpService } from '../email-otp/email-otp.service';
import { UserRepository } from '../user/user.repository';
import { AuthMessages, AuthConfig } from './constants';

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
      throw new BadRequestException(AuthMessages.ERROR.EMAIL_NOT_REGISTERED);
    }

    const otp = await this.otpService.generateOtp(email, user.id);
    return {
      message: AuthMessages.SUCCESS.OTP_SENT_TO_EMAIL,
      expiresAt: otp.expiresAt,
    };
  }

  async verifyOtp(email: string, code: string) {
    const otp = await this.otpService.verifyOtp(email, code);
    if (!otp) {
      throw new UnauthorizedException(
        AuthMessages.ERROR.OTP_INVALID_OR_EXPIRED,
      );
    }

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(AuthMessages.ERROR.USER_NOT_FOUND);
    }

    const payload = { sub: user.publicId, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: AuthConfig.JWT.ACCESS_TOKEN_EXPIRES,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: AuthConfig.JWT.REFRESH_TOKEN_EXPIRES,
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
        throw new UnauthorizedException(
          AuthMessages.ERROR.TOKEN_REFRESH_INVALID,
        );
      }

      const user = await this.userRepo.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException(AuthMessages.ERROR.USER_NOT_FOUND);
      }

      const newPayload = {
        sub: user.publicId,
        email: user.email,
        role: user.role,
      };
      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: AuthConfig.JWT.ACCESS_TOKEN_EXPIRES,
      });

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException(AuthMessages.ERROR.TOKEN_REFRESH_INVALID);
    }
  }
}
