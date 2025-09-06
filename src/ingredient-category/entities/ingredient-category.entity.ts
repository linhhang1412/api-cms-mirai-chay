import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IngredientCategoryConstants } from '../constants';

export class IngredientCategoryEntity {
  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.ID })
  id: number;

  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.CODE })
  code: string;

  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.NAME })
  name: string;

  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  active: boolean;

  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.CREATED_AT })
  createdAt: Date;

  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.UPDATED_AT })
  updatedAt: Date;

  constructor(partial: Partial<IngredientCategoryEntity>) {
    Object.assign(this, partial);
  }
}

