import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SystemSettingService } from '../system-setting/system-setting.service';
import { CloseDayJob } from './close-day.job';

const JOB_NAME = 'inventory-close-day';
const DEFAULT_CRON = '5 0 * * *'; // 00:05 hằng ngày
const TIMEZONE = 'Asia/Ho_Chi_Minh';

@Injectable()
export class CloseDayScheduler implements OnModuleInit {
  private readonly logger = new Logger(CloseDayScheduler.name);

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly settings: SystemSettingService,
    private readonly job: CloseDayJob,
  ) {}

  async onModuleInit() {
    await this.reload();
  }

  async reload() {
    const { cronExpr, timezone } = await this.getCronConfig();

    // Remove existing
    try {
      this.schedulerRegistry.deleteCronJob(JOB_NAME);
      this.logger.log(`Removed existing cron job: ${JOB_NAME}`);
    } catch (e) {
      // ignore if not exists
    }

    const cronJob = new CronJob(
      cronExpr,
      async () => {
        try {
          await this.job.runForYesterday();
        } catch (err) {
          this.logger.error('Close-day job failed', (err as Error).stack);
        }
      },
      null,
      false,
      timezone,
    );

    this.schedulerRegistry.addCronJob(JOB_NAME, cronJob);
    cronJob.start();
    this.logger.log(`Scheduled ${JOB_NAME} with cron='${cronExpr}' tz='${timezone}'`);
  }

  private async getCronConfig(): Promise<{ cronExpr: string; timezone: string }> {
    const cronExpr = (await this.settings.getString('close_day_cron')) || DEFAULT_CRON;
    const timezone = (await this.settings.getString('close_day_timezone')) || TIMEZONE;
    return { cronExpr, timezone };
  }
}
