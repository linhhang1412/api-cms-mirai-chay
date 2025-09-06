import {
  Injectable,
  Logger,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserMessages } from './constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepo: UserRepository) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Đang tạo người dùng với email: ${dto.email}`);
      const user = await this.userRepo.create(dto);
      this.logger.log(`${UserMessages.SUCCESS.USER_CREATED} với ID: ${user.id}`);

      return user;
    } catch (error) {
      this.logger.error(
        `${UserMessages.ERROR.CREATE_USER_FAILED}: ${dto.email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(UserMessages.ERROR.CREATE_USER_FAILED);
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserEntity[]; total: number }> {
    try {
      this.logger.log(`Đang lấy danh sách người dùng - trang: ${page}, giới hạn: ${limit}`);
      const result = await this.userRepo.findAll(page, limit);
      return result;
    } catch (error) {
      this.logger.error(UserMessages.ERROR.FETCH_USERS_FAILED, (error as Error).stack);
      throw new InternalServerErrorException(UserMessages.ERROR.FETCH_USERS_FAILED);
    }
  }

  async getById(id: number): Promise<UserEntity> {
    try {
      this.logger.log(`Đang lấy thông tin người dùng theo ID: ${id}`);
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserMessages.ERROR.FETCH_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.FETCH_USER_FAILED,
      );
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    try {
      this.logger.log(`Đang lấy thông tin người dùng theo email: ${email}`);

      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserMessages.ERROR.FETCH_USER_FAILED}: ${email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.FETCH_USER_FAILED,
      );
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Đang cập nhật người dùng với ID: ${id}`);
      
      // Kiểm tra người dùng có tồn tại không
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
      }

      const user = await this.userRepo.update(id, dto);

      this.logger.log(`Cập nhật người dùng thành công với ID: ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserMessages.ERROR.UPDATE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.UPDATE_USER_FAILED,
      );
    }
  }

  async delete(
    id: number,
    hardDelete: boolean = false,
  ): Promise<{ message: string; user?: UserEntity }> {
    try {
      this.logger.log(
        `Đang xóa người dùng với ID: ${id}, xóa vĩnh viễn: ${hardDelete}`,
      );

      // Kiểm tra người dùng có tồn tại không
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException(UserMessages.ERROR.USER_NOT_FOUND);
      }

      if (hardDelete) {
        await this.userRepo.hardDelete(id);

        this.logger.log(`${UserMessages.SUCCESS.USER_DELETED} với ID: ${id}`);
        return { message: UserMessages.SUCCESS.USER_DELETED };
      } else {
        const user = await this.userRepo.softDelete(id);

        this.logger.log(`${UserMessages.SUCCESS.USER_DEACTIVATED} với ID: ${id}`);
        return { message: UserMessages.SUCCESS.USER_DEACTIVATED, user };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserMessages.ERROR.DELETE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserMessages.ERROR.DELETE_USER_FAILED,
      );
    }
  }
}
