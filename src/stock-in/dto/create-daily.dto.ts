import { ApiProperty } from '@nestjs/swagger';
import { AddStockInItemDto } from './add-item.dto';

export class CreateStockInDailyDto {
  @ApiProperty({ description: 'Danh sách items', type: () => [AddStockInItemDto] })
  items!: AddStockInItemDto[];
  
  @ApiProperty({ description: 'Ghi chú', type: String, required: false })
  note?: string;
}

