import { Injectable, BadRequestException } from '@nestjs/common';
import { EmailOtpRepository } from './email-otp.repository';
import { EmailOtpEntity } from './entity/email-otp.entity';

@Injectable()
export class EmailOtpService {
    constructor(private readonly otpRepo: EmailOtpRepository) { }

    async generateOtp(email: string, userId?: number): Promise<EmailOtpEntity> {
        const code = this.generateCode();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

        // TODO: gửi code qua email (EmailService)
        console.log(`OTP for ${email}: ${code}`);

        return this.otpRepo.create(email, code, expiresAt, userId);
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
        return Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
    }
}
