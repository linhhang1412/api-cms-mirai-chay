import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateLowStockThresholdDto {
  @ApiProperty({ description: 'Ngưỡng mặc định cảnh báo sắp hết', type: Number, example: 5 })
  @IsNumber()
  value!: number;
}

