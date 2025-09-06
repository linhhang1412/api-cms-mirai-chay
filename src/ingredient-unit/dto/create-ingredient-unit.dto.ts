import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { IngredientUnitConstants } from '../constants';

export class CreateIngredientUnitDto {
  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.CODE })
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{1,32}$/i)
  code: string;

  @ApiProperty({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.NAME })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ description: IngredientUnitConstants.FIELDS.DESCRIPTIONS.ACTIVE })
  @IsOptional()
  @IsBoolean()
  active?: boolean = true;
}

