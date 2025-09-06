import { Module } from '@nestjs/common';
import { IngredientUnitService } from './ingredient-unit.service';
import { IngredientUnitRepository } from './ingredient-unit.repository';
import { IngredientUnitController } from './ingredient-unit.controller';

@Module({
  imports: [],
  controllers: [IngredientUnitController],
  providers: [IngredientUnitService, IngredientUnitRepository],
  exports: [IngredientUnitRepository],
})
export class IngredientUnitModule {}

