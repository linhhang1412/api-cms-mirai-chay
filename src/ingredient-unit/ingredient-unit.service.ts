import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IngredientUnitRepository } from './ingredient-unit.repository';
import { CreateIngredientUnitDto } from './dto/create-ingredient-unit.dto';
import { UpdateIngredientUnitDto } from './dto/update-ingredient-unit.dto';
import { IngredientUnitMessages } from './constants';

@Injectable()
export class IngredientUnitService {
  private readonly logger = new Logger(IngredientUnitService.name);
  constructor(private readonly repo: IngredientUnitRepository) {}

  async create(dto: CreateIngredientUnitDto) {
    this.logger.log('Tạo đơn vị nguyên liệu');
    return await this.repo.create(dto);
  }

  async list(page = 1, limit = 10, search?: string) {
    const { items, total } = await this.repo.list(page, limit, search);
    return { items, total, page, limit };
  }

  async getById(id: number) {
    const item = await this.repo.findById(id);
    if (!item) throw new NotFoundException(IngredientUnitMessages.ERROR.NOT_FOUND);
    return item;
  }

  async update(id: number, dto: UpdateIngredientUnitDto) {
    return await this.repo.update(id, dto);
  }

  async delete(id: number, hard = false) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException(IngredientUnitMessages.ERROR.NOT_FOUND);
    if (hard) {
      await this.repo.hardDelete(id);
      return { message: IngredientUnitMessages.SUCCESS.DELETED };
    } else {
      const item = await this.repo.softDelete(id);
      return { message: IngredientUnitMessages.SUCCESS.DEACTIVATED, item };
    }
  }
}

