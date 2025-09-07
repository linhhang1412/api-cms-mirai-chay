import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockInDailyDto {
  @ApiPropertyOptional({ description: 'Ghi chú', type: String })
  note?: string;

  @ApiPropertyOptional({ description: 'ID người cập nhật', type: Number })
  updatedByUserId?: number;
}

