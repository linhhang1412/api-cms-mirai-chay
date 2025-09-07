import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCloseDayConfigDto {
  @ApiProperty({ description: 'Cron expression, ví dụ: 5 0 * * *', type: String })
  @IsString()
  cron!: string;

  @ApiPropertyOptional({ description: 'Timezone, ví dụ: Asia/Ho_Chi_Minh', type: String })
  @IsOptional()
  @IsString()
  timezone?: string;
}

