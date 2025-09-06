import { BadRequestException } from '@nestjs/common';
import { EmailOtpService } from './email-otp.service';
import { EmailOtpRepository } from './email-otp.repository';
import { NotificationService } from '../notification/notification.service';
import { EmailOtpConstants, EmailOtpMessages } from './constants';

describe('EmailOtpService', () => {
  let service: EmailOtpService;
  let repo: jest.Mocked<EmailOtpRepository>;
  let notifier: jest.Mocked<NotificationService>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findActiveOtp: jest.fn(),
      getLatestActiveOtp: jest.fn(),
      incrementAttempts: jest.fn(),
      markAsUsed: jest.fn(),
      revokeActiveByEmail: jest.fn(),
    } as any;

    notifier = {
      sendOtpEmail: jest.fn(),
    } as any;

    service = new EmailOtpService(repo, notifier);
  });

  it('generateOtp: revokes old, creates and sends email', async () => {
    repo.revokeActiveByEmail.mockResolvedValue(0);
    const expiresAt = new Date(
      Date.now() + EmailOtpConstants.DEFAULTS.EXPIRATION_MINUTES * 60 * 1000,
    );
    repo.create.mockImplementation(
      async (email, code, exp, userId) =>
        ({
          id: 1,
          email,
          code,
          expiresAt: exp,
          attempts: 0,
          used: false,
          createdAt: new Date(),
          userId: userId ?? null,
        }) as any,
    );
    notifier.sendOtpEmail.mockResolvedValue();

    const result = await service.generateOtp('user@example.com', 7);

    expect(repo.revokeActiveByEmail).toHaveBeenCalledWith('user@example.com');
    expect(repo.create).toHaveBeenCalled();
    expect(notifier.sendOtpEmail).toHaveBeenCalled();
    const sentArgs = notifier.sendOtpEmail.mock.calls[0];
    const [, sentCode, sentExpiry] = sentArgs;
    expect(sentCode).toHaveLength(EmailOtpConstants.DEFAULTS.OTP_LENGTH);
    expect(sentExpiry instanceof Date).toBe(true);
    expect(result.email).toBe('user@example.com');
    expect(result.used).toBe(false);
  });

  it('verifyOtp: wrong code increments attempts and throws invalid', async () => {
    repo.getLatestActiveOtp.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
      used: false,
      createdAt: new Date(),
      userId: 7,
    } as any);
    repo.incrementAttempts.mockResolvedValue({
      id: 1,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(),
      attempts: 1,
      used: false,
      createdAt: new Date(),
      userId: 7,
    } as any);

    await expect(
      service.verifyOtp('user@example.com', '000000'),
    ).rejects.toThrow(
      new BadRequestException(EmailOtpMessages.ERROR.OTP_INVALID_OR_EXPIRED),
    );
    expect(repo.incrementAttempts).toHaveBeenCalledWith(1);
  });

  it('verifyOtp: reaches max attempts and throws locked', async () => {
    const nearMax = EmailOtpConstants.DEFAULTS.MAX_ATTEMPTS - 1;
    repo.getLatestActiveOtp.mockResolvedValue({
      id: 2,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(Date.now() + 60_000),
      attempts: nearMax,
      used: false,
      createdAt: new Date(),
      userId: 7,
    } as any);
    repo.incrementAttempts.mockResolvedValue({
      id: 2,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(),
      attempts: nearMax + 1,
      used: false,
      createdAt: new Date(),
      userId: 7,
    } as any);

    await expect(
      service.verifyOtp('user@example.com', '000000'),
    ).rejects.toThrow(
      new BadRequestException(EmailOtpMessages.ERROR.OTP_MAX_ATTEMPTS_REACHED),
    );
  });

  it('verifyOtp: correct code marks as used', async () => {
    repo.getLatestActiveOtp.mockResolvedValue({
      id: 3,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(Date.now() + 60_000),
      attempts: 0,
      used: false,
      createdAt: new Date(),
      userId: 7,
    } as any);
    repo.markAsUsed.mockResolvedValue({
      id: 3,
      email: 'user@example.com',
      code: '123456',
      expiresAt: new Date(),
      attempts: 0,
      used: true,
      createdAt: new Date(),
      userId: 7,
    } as any);

    const res = await service.verifyOtp('user@example.com', '123456');
    expect(res.used).toBe(true);
    expect(repo.markAsUsed).toHaveBeenCalledWith(3);
  });
});
