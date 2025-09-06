import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Creating user with email: ${dto.email}`);
      const user = await this.userRepo.create(dto);
      this.logger.log(`User created successfully with ID: ${user.id}`);

      // Clear cache for getAll users
      await this.cacheManager.del('users:all');

      return user;
    } catch (error) {
      this.logger.error(
        `Failed to create user with email: ${dto.email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to create user');
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
        this.logger.log(`Returning cached result for users page ${page}`);
        return cachedResult as { users: UserEntity[]; total: number };
      }

      this.logger.log(`Fetching users - page: ${page}, limit: ${limit}`);
      const result = await this.userRepo.findAll(page, limit);

      // Cache the result
      await this.cacheManager.set(cacheKey, result, 300000); // Cache for 5 minutes

      return result;
    } catch (error) {
      this.logger.error('Failed to fetch users', (error as Error).stack);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getById(id: number): Promise<UserEntity> {
    try {
      this.logger.log(`Fetching user by ID: ${id}`);

      const cacheKey = `user:id:${id}`;
      const cachedUser = await this.cacheManager.get(cacheKey);

      if (cachedUser) {
        this.logger.log(`Returning cached user with ID: ${id}`);
        return cachedUser as UserEntity;
      }

      const user = await this.userRepo.findById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Cache the user
      await this.cacheManager.set(cacheKey, user, 300000); // Cache for 5 minutes

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch user by ID: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async getByEmail(email: string): Promise<UserEntity> {
    try {
      this.logger.log(`Fetching user by email: ${email}`);

      const cacheKey = `user:email:${email}`;
      const cachedUser = await this.cacheManager.get(cacheKey);

      if (cachedUser) {
        this.logger.log(`Returning cached user with email: ${email}`);
        return cachedUser as UserEntity;
      }

      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }

      // Cache the user
      await this.cacheManager.set(cacheKey, user, 300000); // Cache for 5 minutes

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch user by email: ${email}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    try {
      this.logger.log(`Updating user with ID: ${id}`);

      // Check if user exists
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const user = await this.userRepo.update(id, dto);

      // Clear cache for this user and all users
      await this.cacheManager.del(`user:id:${id}`);
      await this.cacheManager.del(`user:email:${user.email}`);
      await this.cacheManager.del('users:all');

      this.logger.log(`User updated successfully with ID: ${id}`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to update user with ID: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async delete(
    id: number,
    hardDelete: boolean = false,
  ): Promise<{ message: string; user?: UserEntity }> {
    try {
      this.logger.log(
        `Deleting user with ID: ${id}, hardDelete: ${hardDelete}`,
      );

      // Check if user exists
      const existingUser = await this.userRepo.findById(id);
      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (hardDelete) {
        await this.userRepo.hardDelete(id);
        // Clear cache for this user and all users
        await this.cacheManager.del(`user:id:${id}`);
        await this.cacheManager.del(`user:email:${existingUser.email}`);
        await this.cacheManager.del('users:all');

        this.logger.log(`User permanently deleted with ID: ${id}`);
        return { message: 'User permanently deleted' };
      } else {
        const user = await this.userRepo.softDelete(id);

        // Clear cache for this user and all users
        await this.cacheManager.del(`user:id:${id}`);
        await this.cacheManager.del(`user:email:${user.email}`);
        await this.cacheManager.del('users:all');

        this.logger.log(`User deactivated with ID: ${id}`);
        return { message: 'User deactivated', user };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete user with ID: ${id}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
