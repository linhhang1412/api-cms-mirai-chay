import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from 'generated/prisma';
import { IngredientConstants } from '../constants';

export class IngredientEntity {
  @ApiProperty({ description: IngredientConstants.FIELDS.DESCRIPTIONS.ID })
  id: number;

  @ApiProperty({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.PUBLIC_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.PUBLIC_ID,
  })
  publicId: string;

  @ApiProperty({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CODE,
    example: IngredientConstants.FIELDS.EXAMPLES.CODE,
  })
  code: string;

  @ApiProperty({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.NAME,
    example: IngredientConstants.FIELDS.EXAMPLES.NAME,
  })
  name: string;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CATEGORY_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.CATEGORY_ID,
  })
  categoryId?: number | null;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.UNIT_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.UNIT_ID,
  })
  unitId?: number | null;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.REFERENCE_PRICE,
    example: IngredientConstants.FIELDS.EXAMPLES.REFERENCE_PRICE,
  })
  referencePrice?: any | null; // Prisma Decimal serialized

  @ApiPropertyOptional({ description: 'Ngưỡng cảnh báo sắp hết (theo đơn vị cơ bản)' })
  minStock?: any | null; // Prisma Decimal serialized

  @ApiProperty({ description: IngredientConstants.FIELDS.DESCRIPTIONS.STATUS, enum: Status })
  status: Status;

  @ApiProperty({ description: IngredientConstants.FIELDS.DESCRIPTIONS.CREATED_AT })
  createdAt: Date;

  @ApiProperty({ description: IngredientConstants.FIELDS.DESCRIPTIONS.UPDATED_AT })
  updatedAt: Date;

  constructor(partial: Partial<IngredientEntity>) {
    Object.assign(this, partial);
  }
}
