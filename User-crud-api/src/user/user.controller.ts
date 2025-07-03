import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users') // Base route for all user-related endpoints
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Handles POST requests to create a new user.
   * @param createUserDto The data for the new user from the request body.
   * @returns The created user.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Set HTTP status code to 201 Created
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
   * Handles GET requests to retrieve all users.
   * @returns An array of users.
   */
  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
   * Handles GET requests to retrieve a single user by ID.
   * @param id The ID of the user from the URL parameter.
   * @returns The found user.
   */
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    // Use the unary plus operator (+) to convert the string ID to a number
    return this.userService.findOne(+id);
  }

  /**
   * Handles PATCH requests to update an existing user by ID.
   * @param id The ID of the user from the URL parameter.
   * @param updateUserDto The update data from the request body.
   * @returns The updated user.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * Handles DELETE requests to remove a user by ID.
   * @param id The ID of the user from the URL parameter.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Set HTTP status code to 204 No Content for successful deletion
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }
}
