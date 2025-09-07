import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockOutItemDto {
  @ApiPropertyOptional({ description: 'Số lượng', type: Number })
  quantity?: number;

  @ApiPropertyOptional({ description: 'ID người cập nhật', type: Number })
  updatedByUserId?: number;

  @ApiPropertyOptional({ description: 'Ghi chú', type: String })
  note?: string;
}

