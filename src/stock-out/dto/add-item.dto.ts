import { ApiProperty } from '@nestjs/swagger';

export class AddStockOutItemDto {
  @ApiProperty({ description: 'publicId của nguyên liệu', type: String })
  ingredientPublicId!: string;

  @ApiProperty({ description: 'Số lượng xuất', type: Number })
  quantity!: number;

  @ApiProperty({ description: 'ID người thực hiện', type: Number })
  createdByUserId!: number;

  @ApiProperty({ description: 'Ghi chú', type: String, required: false })
  note?: string;
}

