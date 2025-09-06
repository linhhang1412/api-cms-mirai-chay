import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import { NotificationConfig, NotificationMessages } from './constants';

@Injectable()
export class NotificationService {
  private readonly resend: Resend | null;
  private readonly templatesPath: string;
  private readonly compiledTemplates: Map<string, Handlebars.TemplateDelegate> =
    new Map();
  private readonly logger = new Logger(NotificationService.name);
  private readonly dryRun: boolean;

  constructor() {
    const apiKey = process.env[NotificationConfig.ENV.RESEND_API_KEY];
    if (!apiKey) {
      this.logger.warn(NotificationMessages.WARN.MISSING_API_KEY);
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
      this.logger.log(
        NotificationMessages.LOG.START_RENDER_OTP.replace('{{to}}', to),
      );

      // Compile template with context
      const html = await this.renderTemplate(NotificationConfig.TEMPLATES.OTP, {
        title: 'Xác thực đăng nhập - Mirai Chay',
        headerTitle: 'Xác thực đăng nhập',
        code,
        expiryTime: expiresAt,
      });

      this.logger.log(
        NotificationMessages.LOG.TEMPLATE_RENDERED.replace('{{to}}', to),
      );

      // Log content only in non-production and dry-run
      const isProd = process.env.NODE_ENV === 'production';
      if (!isProd) {
        this.logger.debug(
          `Mã OTP cho ${to}: [ẨN TRONG LOG]. Hết hạn lúc: ${expiresAt.toISOString()}`,
        );
      }

      // Send email via Resend or dry-run
      if (this.dryRun || !this.resend) {
        this.logger.log(
          NotificationMessages.LOG.DRY_RUN_SEND.replace('{{to}}', to),
        );
        return;
      }

      this.logger.log(
        NotificationMessages.LOG.SENDING_EMAIL.replace('{{to}}', to),
      );
      const response = await this.resend.emails.send({
        from: NotificationConfig.EMAIL.FROM,
        to,
        subject: NotificationConfig.EMAIL.SUBJECTS.OTP,
        html,
      });

      if (!isProd) {
        this.logger.log(
          NotificationMessages.LOG.SENT_SUCCESS_DEV.replace(
            '{{to}}',
            to,
          ).replace('{{response}}', JSON.stringify(response)),
        );
      }
    } catch (error) {
      this.logger.error(
        NotificationMessages.ERROR.SEND_FAILED.replace('{{to}}', to).replace(
          '{{message}}',
          (error as Error).message,
        ),
      );
      throw new InternalServerErrorException(
        NotificationMessages.ERROR.SEND_FAILED_USER,
      );
    }
  }

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    // Get base template
    const baseTemplate = await this.getCompiledTemplate(
      NotificationConfig.TEMPLATES.BASE,
    );

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
    this.logger.log(
      NotificationMessages.LOG.READING_TEMPLATE.replace(
        '{{path}}',
        templatePath,
      ),
    );

    const templateContent = await fs.promises.readFile(templatePath, 'utf8');

    // Compile and cache
    const compiled = Handlebars.compile(templateContent);
    this.compiledTemplates.set(templateName, compiled);

    this.logger.log(
      NotificationMessages.LOG.TEMPLATE_COMPILED.replace(
        '{{name}}',
        templateName,
      ),
    );
    return compiled;
  }
}
