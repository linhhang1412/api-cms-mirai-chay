import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IngredientCategoryConstants } from '../constants';

export class CreateIngredientCategoryDto {
  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.CODE })
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{2,32}$/i)
  code: string;

  @ApiProperty({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.NAME })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ description: IngredientCategoryConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}

