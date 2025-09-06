import { Module } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { IngredientRepository } from './ingredient.repository';

@Module({
  imports: [],
  controllers: [IngredientController],
  providers: [IngredientService, IngredientRepository],
  exports: [IngredientRepository],
})
export class IngredientModule {}

