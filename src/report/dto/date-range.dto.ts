import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiPropertyOptional({ description: 'YYYY-MM-DD', type: String })
  from?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD', type: String })
  to?: string;
}

