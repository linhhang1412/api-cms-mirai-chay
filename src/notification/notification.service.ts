import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';

@Injectable()
export class NotificationService {
  private readonly resend: Resend;
  private readonly templatesPath: string;
  private readonly compiledTemplates: Map<string, Handlebars.TemplateDelegate> = new Map();

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.templatesPath = path.join(__dirname, 'templates');
    
    // Register helper to format date
    Handlebars.registerHelper('formatDate', (date) => {
      return new Date(date).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    });
  }

  async sendOtpEmail(to: string, code: string, expiresAt: Date): Promise<void> {
    try {
      // Compile template with context
      const html = await this.renderTemplate('otp', {
        title: 'Xác thực đăng nhập - Mirai Chay',
        headerTitle: 'Xác thực đăng nhập',
        code,
        expiryTime: expiresAt
      });

      // Send email via Resend
      await this.resend.emails.send({
        from: 'Mirai Chay <no-reply@mirai-chay.com>',
        to,
        subject: 'Mã xác thực đăng nhập Mirai Chay',
        html,
      });
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new InternalServerErrorException('Failed to send OTP email');
    }
  }

  private async renderTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    // Get base template
    const baseTemplate = await this.getCompiledTemplate('base');
    
    // Get specific template
    const specificTemplate = await this.getCompiledTemplate(templateName);
    
    // Render specific content
    const specificContent = specificTemplate(context);
    
    // Render with base template
    return baseTemplate({
      ...context,
      body: specificContent
    });
  }

  private async getCompiledTemplate(templateName: string): Promise<Handlebars.TemplateDelegate> {
    // Check if already compiled
    if (this.compiledTemplates.has(templateName)) {
      return this.compiledTemplates.get(templateName)!;
    }

    // Read template file
    const templatePath = path.join(this.templatesPath, `${templateName}.hbs`);
    const templateContent = await fs.promises.readFile(templatePath, 'utf8');
    
    // Compile and cache
    const compiled = Handlebars.compile(templateContent);
    this.compiledTemplates.set(templateName, compiled);
    
    return compiled;
  }
}