import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) { }

  create(dto: CreateUserDto) {
    return this.userRepo.create(dto);
  }

  getAll() {
    return this.userRepo.findAll();
  }

  getByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }
}
