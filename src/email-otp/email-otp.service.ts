import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { EmailOtpRepository } from './email-otp.repository';
import { EmailOtpEntity } from './entity/email-otp.entity';
import { NotificationService } from '../notification/notification.service';
import {
  EmailOtpConstants,
  EmailOtpMessages,
} from './constants';
import { randomInt } from 'crypto';

@Injectable()
export class EmailOtpService {
  constructor(
    private readonly otpRepo: EmailOtpRepository,
    private readonly notificationService: NotificationService,
  ) {}
  private readonly logger = new Logger(EmailOtpService.name);

  async generateOtp(email: string, userId?: number): Promise<EmailOtpEntity> {
    const code = this.generateCode();
    const expiresAt = new Date(
      Date.now() + EmailOtpConstants.DEFAULTS.EXPIRATION_MINUTES * 60 * 1000,
    ); // 5 phút

    // Vô hiệu hóa các OTP đang hoạt động trước đó (nếu có)
    try {
      const revoked = await this.otpRepo.revokeActiveByEmail(email);
      if (revoked > 0) {
        this.logger.debug(
          EmailOtpMessages.LOG.REVOKED_OLD_OTPS.replace('{{count}}', String(revoked)).replace(
            '{{email}}',
            email,
          ),
        );
      }
    } catch (e) {
      this.logger.warn(
        EmailOtpMessages.LOG.REVOKE_FAILED.replace('{{email}}', email),
      );
    }

    // Tạo OTP trong database
    const otp = await this.otpRepo.create(email, code, expiresAt, userId);

    // Gửi OTP qua email
    try {
      await this.notificationService.sendOtpEmail(email, code, expiresAt);
    } catch (error) {
      // Log error nhưng không throw để không làm gián đoạn quy trình
      this.logger.error(
        `${EmailOtpMessages.LOG.SEND_FAILED}: ${(error as Error).message}`,
      );
    }

    return otp;
  }

  async verifyOtp(email: string, code: string): Promise<EmailOtpEntity> {
    const latest = await this.otpRepo.getLatestActiveOtp(email);

    if (!latest) {
      throw new BadRequestException(
        EmailOtpMessages.ERROR.OTP_INVALID_OR_EXPIRED,
      );
    }

    if (latest.attempts >= EmailOtpConstants.DEFAULTS.MAX_ATTEMPTS) {
      throw new BadRequestException(
        EmailOtpMessages.ERROR.OTP_MAX_ATTEMPTS_REACHED,
      );
    }

    if (latest.code !== code) {
      const updated = await this.otpRepo.incrementAttempts(latest.id);
      if (updated.attempts >= EmailOtpConstants.DEFAULTS.MAX_ATTEMPTS) {
        throw new BadRequestException(
          EmailOtpMessages.ERROR.OTP_MAX_ATTEMPTS_REACHED,
        );
      }
      throw new BadRequestException(
        EmailOtpMessages.ERROR.OTP_INVALID_OR_EXPIRED,
      );
    }

    // Mã đúng, mark as used
    return this.otpRepo.markAsUsed(latest.id);
  }

  private generateCode(): string {
    // Tạo mã OTP với độ dài được cấu hình bằng crypto.randomInt
    const length = EmailOtpConstants.DEFAULTS.OTP_LENGTH;
    const max = 10 ** length;
    const value = randomInt(0, max);
    return value.toString().padStart(length, '0');
  }
}
