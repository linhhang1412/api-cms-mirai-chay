import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) { }

  create(dto: CreateUserDto) {
    return this.userRepo.create(dto);
  }

  getAll() {
    return this.userRepo.findAll();
  }

  getById(id: number) {
    return this.userRepo.findById(id);
  }

  getByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.userRepo.update(id, dto);
  }

  async delete(id: number, hardDelete: boolean = false) {
    if (hardDelete) {
      await this.userRepo.hardDelete(id);
      return { message: 'User permanently deleted' };
    } else {
      const user = await this.userRepo.softDelete(id);
      return { message: 'User deactivated', user };
    }
  }
}
