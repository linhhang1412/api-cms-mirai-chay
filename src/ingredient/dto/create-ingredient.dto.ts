import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Matches, MaxLength, IsInt, Min, IsNumber } from 'class-validator';
import { Status } from 'generated/prisma';
import { IngredientConstants } from '../constants';

export class CreateIngredientDto {
  @ApiProperty({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CODE,
    example: IngredientConstants.FIELDS.EXAMPLES.CODE,
  })
  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9-_\.]{2,32}$/i, {
    message: 'Code chỉ gồm chữ, số, gạch ngang, gạch dưới, chấm (2-32 ký tự)',
  })
  code: string;

  @ApiProperty({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.NAME,
    example: IngredientConstants.FIELDS.EXAMPLES.NAME,
  })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({
    description: IngredientConstants.FIELDS.DESCRIPTIONS.CATEGORY_ID,
    example: IngredientConstants.FIELDS.EXAMPLES.CATEGORY_ID,
    required: false,
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
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status = Status.ACTIVE;
}
