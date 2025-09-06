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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { UserErrorMessages, UserSuccessMessages } from './constants/messages.constants';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Đang tạo người dùng với email: ${dto.email}`);
      const user = await this.userRepo.create(dto);
      this.logger.log(`${UserSuccessMessages.USER_CREATED} với ID: ${user.id}`);

      // Xóa cache cho danh sách tất cả người dùng
      await this.cacheManager.del('users:all');

      return user;
    } catch (error) {
      this.logger.error(
        `${UserErrorMessages.CREATE_USER_FAILED}: ${dto.email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(UserErrorMessages.CREATE_USER_FAILED);
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: UserEntity[]; total: number }> {
    try {
      const cacheKey = `users:all:${page}:${limit}`;
      const cachedResult = await this.cacheManager.get(cacheKey);

      if (cachedResult) {
        this.logger.log(`Trả về kết quả đã cache cho trang người dùng ${page}`);
        return cachedResult as { users: UserEntity[]; total: number };
      }

      this.logger.log(`Đang lấy danh sách người dùng - trang: ${page}, giới hạn: ${limit}`);
      const result = await this.userRepo.findAll(page, limit);

      // Cache kết quả
      await this.cacheManager.set(cacheKey, result, 300000); // Cache for 5 minutes

      return result;
    } catch (error) {
      this.logger.error(
        UserErrorMessages.FETCH_USERS_FAILED,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserErrorMessages.FETCH_USERS_FAILED,
      );
    }
  }

  async getById(id: number): Promise<UserEntity> {
    try {
      this.logger.log(`Đang lấy thông tin người dùng theo ID: ${id}`);
      
      const cacheKey = `user:id:${id}`;
      const cachedUser = await this.cacheManager.get(cacheKey);
      
      if (cachedUser) {
        this.logger.log(`Trả về người dùng đã cache với ID: ${id}`);
        return cachedUser as UserEntity;
      }
      
      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
      }
      
      // Cache người dùng
      await this.cacheManager.set(cacheKey, user, 300000); // Cache trong 5 phút
      
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserErrorMessages.FETCH_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserErrorMessages.FETCH_USER_FAILED,
      );
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    try {
      this.logger.log(`Đang lấy thông tin người dùng theo email: ${email}`);

      const cacheKey = `user:email:${email}`;
      const cachedUser = await this.cacheManager.get(cacheKey);

      if (cachedUser) {
        this.logger.log(`Trả về người dùng đã cache với email: ${email}`);
        return cachedUser as UserEntity;
      }

      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
      }

      // Cache người dùng
      await this.cacheManager.set(cacheKey, user, 300000); // Cache for 5 minutes

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserErrorMessages.FETCH_USER_FAILED}: ${email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserErrorMessages.FETCH_USER_FAILED,
      );
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Đang cập nhật người dùng với ID: ${id}`);

      // Kiểm tra người dùng có tồn tại không
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
      }

      const user = await this.userRepo.update(id, dto);

      // Xóa cache cho người dùng này và tất cả người dùng
      await this.cacheManager.del(`user:id:${id}`);
      await this.cacheManager.del(`user:email:${user.email}`);
      await this.cacheManager.del('users:all');

      this.logger.log(`Cập nhật người dùng thành công với ID: ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserErrorMessages.UPDATE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserErrorMessages.UPDATE_USER_FAILED,
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
        throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
      }

      if (hardDelete) {
        await this.userRepo.hardDelete(id);
        // Xóa cache cho người dùng này và tất cả người dùng
        await this.cacheManager.del(`user:id:${id}`);
        await this.cacheManager.del(`user:email:${existingUser.email}`);
        await this.cacheManager.del('users:all');

        this.logger.log(`${UserSuccessMessages.USER_DELETED} với ID: ${id}`);
        return { message: UserSuccessMessages.USER_DELETED };
      } else {
        const user = await this.userRepo.softDelete(id);

        // Xóa cache cho người dùng này và tất cả người dùng
        await this.cacheManager.del(`user:id:${id}`);
        await this.cacheManager.del(`user:email:${user.email}`);
        await this.cacheManager.del('users:all');

        this.logger.log(`${UserSuccessMessages.USER_DEACTIVATED} với ID: ${id}`);
        return { message: UserSuccessMessages.USER_DEACTIVATED, user };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `${UserErrorMessages.DELETE_USER_FAILED}: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        UserErrorMessages.DELETE_USER_FAILED,
      );
    }
  }
}
