import { Module } from '@nestjs/common';
import { EmailOtpRepository } from './email-otp.repository';
import { EmailOtpService } from './email-otp.service';
import { EmailOtpController } from './email-otp.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
    imports: [NotificationModule],
    controllers: [EmailOtpController],
    providers: [EmailOtpService, EmailOtpRepository],
    exports: [EmailOtpService],
})
export class EmailOtpModule { }
