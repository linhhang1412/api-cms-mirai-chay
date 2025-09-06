import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientUnitDto } from './create-ingredient-unit.dto';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IngredientUnitConstants } from '../constants';

export class UpdateIngredientUnitDto extends PartialType(CreateIngredientUnitDto) {
  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.CODE })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{1,32}$/i)
  code?: string;

  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.NAME })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

