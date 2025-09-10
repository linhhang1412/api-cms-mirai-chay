import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from './ingredient.repository';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientMessages } from './constants';
import { UpdateMinStockDto } from './dto/update-min-stock.dto';
import { Status } from 'generated/prisma';

@Injectable()
export class IngredientService {
  private readonly logger = new Logger(IngredientService.name);

  constructor(private readonly ingredientRepo: IngredientRepository) {}

  async create(dto: CreateIngredientDto) {
    this.logger.log('Tạo nguyên liệu mới');
    return await this.ingredientRepo.create(dto);
  }

  async getAll(page = 1, limit = 10, search?: string, status?: Status) {
    this.logger.log('Lấy danh sách nguyên liệu');
    const { items, total } = await this.ingredientRepo.list(page, limit, search, status);
    return { items, total, page, limit };
  }

  async getById(id: number) {
    const item = await this.ingredientRepo.findById(id);
    if (!item) {
      throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
    }
    return item;
  }

  async update(id: number, dto: UpdateIngredientDto) {
    this.logger.log(`Cập nhật nguyên liệu: ${id}`);
    return await this.ingredientRepo.update(id, dto);
  }

  async delete(id: number, hardDelete = false) {
    this.logger.log(
      `Xóa nguyên liệu ID: ${id}, xóa vĩnh viễn: ${hardDelete}`,
    );
    const existing = await this.ingredientRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(IngredientMessages.ERROR.NOT_FOUND);
    }

    if (hardDelete) {
      await this.ingredientRepo.hardDelete(id);
      return { message: IngredientMessages.SUCCESS.DELETED };
    } else {
      const item = await this.ingredientRepo.softDelete(id);
      return { message: IngredientMessages.SUCCESS.DEACTIVATED, item };
    }
  }

  async updateMinStock(id: number, dto: UpdateMinStockDto) {
    this.logger.log(`Cập nhật minStock cho nguyên liệu: ${id}`);
    return await this.ingredientRepo.updateMinStock(id, dto.minStock);
  }
}
