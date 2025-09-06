import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import { EmailOtpEntity } from './entity/email-otp.entity';

@Injectable()
export class EmailOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    email: string,
    code: string,
    expiresAt: Date,
    userId?: number,
  ): Promise<EmailOtpEntity> {
    const otp = await this.prisma.emailOtp.create({
      data: {
        email,
        code,
        expiresAt,
        userId,
        createdAt: new Date(),
      },
    });
    return new EmailOtpEntity(otp);
  }

  async findActiveOtp(
    email: string,
    code: string,
  ): Promise<EmailOtpEntity | null> {
    const otp = await this.prisma.emailOtp.findFirst({
      where: {
        email,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });
    return otp ? new EmailOtpEntity(otp) : null;
  }

  async getLatestActiveOtp(email: string): Promise<EmailOtpEntity | null> {
    const otp = await this.prisma.emailOtp.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    return otp ? new EmailOtpEntity(otp) : null;
  }

  async incrementAttempts(id: number): Promise<EmailOtpEntity> {
    const otp = await this.prisma.emailOtp.update({
      where: { id },
      data: { attempts: { increment: 1 } },
    });
    return new EmailOtpEntity(otp);
  }

  async markAsUsed(id: number): Promise<EmailOtpEntity> {
    const otp = await this.prisma.emailOtp.update({
      where: { id },
      data: { used: true },
    });
    return new EmailOtpEntity(otp);
  }

  async revokeActiveByEmail(email: string): Promise<number> {
    const res = await this.prisma.emailOtp.updateMany({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      data: { used: true },
    });
    return res.count;
  }
}
