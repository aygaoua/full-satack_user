import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // Import the User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity with TypeORM for this module
  controllers: [UserController], // Register the UserController
  providers: [UserService], // Register the UserService
})
export class UserModule {}
