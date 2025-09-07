import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';

@Injectable()
export class SystemSettingService {
  private readonly logger = new Logger(SystemSettingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getString(key: string): Promise<string | null> {
    try {
      const rec = await this.prisma.systemSetting.findUnique({ where: { key } });
      return rec?.value ?? null;
    } catch (e) {
      // Table may not exist yet; let caller fallback
      this.logger.warn(`getString failed for key='${key}': ${(e as Error).message}`);
      return null;
    }
  }

  async getStringOrDefault(key: string, defaultValue: string): Promise<string> {
    return (await this.getString(key)) ?? defaultValue;
  }

  async setString(key: string, value: string): Promise<void> {
    await this.prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}

