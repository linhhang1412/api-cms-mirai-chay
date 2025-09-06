import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailOtpModule } from '../email-otp/email-otp.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { RolesGuard } from './roles.guard';
import { AuthConfig } from './constants';

@Module({
  imports: [
    UserModule,
    EmailOtpModule,
    NotificationModule,
    JwtModule.register({
      secret: AuthConfig.JWT.SECRET_KEY,
      signOptions: { expiresIn: AuthConfig.JWT.ACCESS_TOKEN_EXPIRES },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}
