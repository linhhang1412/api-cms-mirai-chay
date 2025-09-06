import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IngredientUnitConstants } from '../constants';

export class IngredientUnitEntity {
  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.ID })
  id: number;

  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.CODE })
  code: string;

  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.NAME })
  name: string;

  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  active: boolean;

  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.CREATED_AT })
  createdAt: Date;

  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.UPDATED_AT })
  updatedAt: Date;

  constructor(partial: Partial<IngredientUnitEntity>) {
    Object.assign(this, partial);
  }
}

