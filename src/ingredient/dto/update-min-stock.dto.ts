import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateMinStockDto {
  @ApiProperty({ description: 'Ngưỡng cảnh báo sắp hết (đơn vị cơ bản)', example: 5 })
  @IsNumber()
  minStock!: number;
}

