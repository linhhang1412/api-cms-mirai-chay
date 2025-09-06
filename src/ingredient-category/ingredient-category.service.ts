import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IngredientCategoryRepository } from './ingredient-category.repository';
import { CreateIngredientCategoryDto } from './dto/create-ingredient-category.dto';
import { UpdateIngredientCategoryDto } from './dto/update-ingredient-category.dto';
import { IngredientCategoryMessages } from './constants';

@Injectable()
export class IngredientCategoryService {
  private readonly logger = new Logger(IngredientCategoryService.name);

  constructor(private readonly repo: IngredientCategoryRepository) {}

  async create(dto: CreateIngredientCategoryDto) {
    this.logger.log('Tạo danh mục nguyên liệu');
    return await this.repo.create(dto);
  }

  async list(page = 1, limit = 10, search?: string) {
    const { items, total } = await this.repo.list(page, limit, search);
    return { items, total, page, limit };
  }

  async getById(id: number) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(IngredientCategoryMessages.ERROR.NOT_FOUND);
    return item;
  }

  async update(id: number, dto: UpdateIngredientCategoryDto) {
    return await this.repo.update(id, dto);
  }

  async delete(id: number, hard = false) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(IngredientCategoryMessages.ERROR.NOT_FOUND);
    if (hard) {
      await this.repo.hardDelete(id);
      return { message: IngredientCategoryMessages.SUCCESS.DELETED };
    } else {
      const item = await this.repo.softDelete(id);
      return { message: IngredientCategoryMessages.SUCCESS.DEACTIVATED, item };
    }
  }
}

