import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockOutDailyDto {
  @ApiPropertyOptional({ description: 'Ngày nghiệp vụ (YYYY-MM-DD)', type: String })
  stockDate?: string;

  @ApiPropertyOptional({ description: 'Ghi chú', type: String })
  note?: string;

  @ApiPropertyOptional({ description: 'ID người tạo', type: Number })
  createdByUserId?: number;
}

