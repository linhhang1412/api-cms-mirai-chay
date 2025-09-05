import { Injectable, BadRequestException } from '@nestjs/common';
import { EmailOtpRepository } from './email-otp.repository';
import { EmailOtpEntity } from './entity/email-otp.entity';
import { NotificationService } from '../notification/notification.service';
import { AuthOtpConfig } from '../auth/auth.messages';

@Injectable()
export class EmailOtpService {
  constructor(
    private readonly otpRepo: EmailOtpRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async generateOtp(email: string, userId?: number): Promise<EmailOtpEntity> {
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // Tạo OTP trong database
    const otp = await this.otpRepo.create(email, code, expiresAt, userId);

    // Gửi OTP qua email
    try {
      await this.notificationService.sendOtpEmail(email, code, expiresAt);
    } catch (error) {
      // Log error nhưng không throw để không làm gián đoạn quy trình
      console.error('Failed to send OTP email:', error);
    }

    return otp;
  }

  async verifyOtp(email: string, code: string): Promise<EmailOtpEntity> {
    const otp = await this.otpRepo.findActiveOtp(email, code);

    if (!otp) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
    }

    if (otp.attempts >= 5) {
      throw new BadRequestException('OTP bị khóa do nhập sai quá nhiều lần');
    }

    // Mark as used
    return this.otpRepo.markAsUsed(otp.id);
  }

  private generateCode(): string {
    // Tạo mã OTP với độ dài được cấu hình
    const min = Math.pow(10, AuthOtpConfig.LENGTH - 1);
    const max = Math.pow(10, AuthOtpConfig.LENGTH) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }
}
