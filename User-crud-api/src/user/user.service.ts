import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'; // Import ConflictException
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { QueryFailedError } from 'typeorm'; // Import QueryFailedError

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the database.
   * Handles duplicate email errors gracefully.
   * @param createUserDto The data for the new user.
   * @returns The created user entity.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);
    try {
      return await this.usersRepository.save(newUser); // Attempt to save the new user
    } catch (error) {
      // Check if the error is a TypeORM QueryFailedError
      if (error instanceof QueryFailedError) {
        // PostgreSQL unique violation error code is '23505'
        if (error.driverError && error.driverError.code === '23505') {
          throw new ConflictException('Email address already exists.'); // Throw a 409 Conflict exception
        }
      }
      // Re-throw other unexpected errors
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   * @returns An array of user entities.
   */
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Retrieves a single user by their ID.
   * Throws NotFoundException if the user is not found.
   * @param id The ID of the user to retrieve.
   * @returns The found user entity.
   */
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Updates an existing user by their ID.
   * Throws NotFoundException if the user to update is not found.
   * @param id The ID of the user to update.
   * @param updateUserDto The data to update the user with.
   * @returns The updated user entity.
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // First, find the user to ensure it exists
    Object.assign(user, updateUserDto); // Merge the update data into the existing user object
    try {
      return await this.usersRepository.save(user); // Attempt to save the updated user
    } catch (error) {
      if (error instanceof QueryFailedError) {
        if (error.driverError && error.driverError.code === '23505') {
          throw new ConflictException('Email address already exists for another user.'); // Handle duplicate email on update
        }
      }
      throw error;
    }
  }

  /**
   * Removes a user by their ID.
   * Throws NotFoundException if the user to remove is not found.
   * @param id The ID of the user to remove.
   */
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}

