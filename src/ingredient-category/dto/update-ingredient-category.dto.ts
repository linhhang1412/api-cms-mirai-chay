import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientCategoryDto } from './create-ingredient-category.dto';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IngredientCategoryConstants } from '../constants';

export class UpdateIngredientCategoryDto extends PartialType(
  CreateIngredientCategoryDto,
) {
  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.CODE })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{2,32}$/i)
  code?: string;

  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.NAME })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

