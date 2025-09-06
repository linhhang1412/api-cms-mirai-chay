import { Module } from '@nestjs/common';
import { IngredientCategoryService } from './ingredient-category.service';
import { IngredientCategoryRepository } from './ingredient-category.repository';
import { IngredientCategoryController } from './ingredient-category.controller';

@Module({
  imports: [],
  controllers: [IngredientCategoryController],
  providers: [IngredientCategoryService, IngredientCategoryRepository],
  exports: [IngredientCategoryRepository],
})
export class IngredientCategoryModule {}

