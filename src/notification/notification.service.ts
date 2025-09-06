import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class NotificationService {
  private readonly resend: Resend | null;
  private readonly templatesPath: string;
  private readonly compiledTemplates: Map<string, Handlebars.TemplateDelegate> =
    new Map();
  private readonly logger = new Logger(NotificationService.name);
  private readonly dryRun: boolean;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set. Email sending is in dry-run mode.');
      this.resend = null;
      this.dryRun = true;
    } else {
      this.resend = new Resend(apiKey);
      this.dryRun = false;
    }
    // Sử dụng đường dẫn tương đối đến thư mục templates
    this.templatesPath = path.join(__dirname, 'templates');

    // Register helper to format date
    Handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    });
  }

  async sendOtpEmail(to: string, code: string, expiresAt: Date): Promise<void> {
    try {
      this.logger.log(`Bắt đầu tạo template email OTP cho ${to}`);

      // Compile template with context
      const html = await this.renderTemplate('otp', {
        title: 'Xác thực đăng nhập - Mirai Chay',
        headerTitle: 'Xác thực đăng nhập',
        code,
        expiryTime: expiresAt,
      });

      this.logger.log(`Template email OTP đã được tạo cho ${to}`);

      // Log content only in non-production and dry-run
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        this.logger.debug(`OTP for ${to}: [REDACTED in logs]. Expires at: ${expiresAt.toISOString()}`);
      }

      // Send email via Resend or dry-run
      if (this.dryRun || !this.resend) {
        this.logger.log(`Dry-run: pretend sending OTP email to ${to}`);
        return;
      }

      this.logger.log(`Đang gửi email OTP đến ${to}`);
      const response = await this.resend.emails.send({
        from: 'Mirai Chay <no-reply@dev.miraichay.com>',
        to,
        subject: 'Mã xác thực đăng nhập Mirai Chay',
        html,
      });

      if (!isProd) {
        this.logger.log(
          `Email OTP đã được gửi thành công đến ${to}. Response: ${JSON.stringify(
            response,
          )}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${to}: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    // Get base template
    const baseTemplate = await this.getCompiledTemplate('base');

    // Get specific template
    const specificTemplate = await this.getCompiledTemplate(templateName);

    // Render specific content
    const specificContent = specificTemplate(context);

    // Render with base template
    return baseTemplate({
      ...context,
      body: specificContent,
    });
  }

  private async getCompiledTemplate(
    templateName: string,
  ): Promise<Handlebars.TemplateDelegate> {
    // Check if already compiled
    if (this.compiledTemplates.has(templateName)) {
      return this.compiledTemplates.get(templateName)!;
    }

    // Read template file
    const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
    this.logger.log(`Đang đọc template từ: ${templatePath}`);

    const templateContent = await fs.promises.readFile(templatePath, 'utf8');

    // Compile and cache
    const compiled = Handlebars.compile(templateContent);
    this.compiledTemplates.set(templateName, compiled);

    this.logger.log(`Template ${templateName} đã được biên dịch thành công`);
    return compiled;
  }
}
