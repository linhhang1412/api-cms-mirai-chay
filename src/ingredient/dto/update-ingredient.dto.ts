import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, IsInt, Min, IsNumber } from 'class-validator';
import { Status } from 'generated/prisma';
import { PartialType } from '@nestjs/mapped-types';
import { CreateIngredientDto } from './create-ingredient.dto';
import { IngredientConstants } from '../constants';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {
  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CODE,
    example: IngredientConstants.FIELDS.EXAMPLES.CODE,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{2,32}$/i)
  code?: string;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.NAME,
    example: IngredientConstants.FIELDS.EXAMPLES.NAME,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CATEGORY_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.CATEGORY_ID,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.UNIT_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.UNIT_ID,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  unitId?: number;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.REFERENCE_PRICE,
    example: IngredientConstants.FIELDS.EXAMPLES.REFERENCE_PRICE,
  })
  @IsOptional()
  @IsNumber()
  referencePrice?: number;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.STATUS,
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
