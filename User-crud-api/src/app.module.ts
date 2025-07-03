import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity'; // Import your User entity

@Module({
  imports: [
    // Configure ConfigModule to load environment variables
    // It's important that ConfigModule is loaded before TypeOrmModule.forRootAsync
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available globally
      envFilePath: ['.env'], // Specify the path to your .env file
    }),
    // Configure TypeORM to connect to PostgreSQL asynchronously
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule so ConfigService can be injected
      inject: [ConfigService], // Inject ConfigService into the factory function
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Specify database type
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User], // Register your User entity here
        synchronize: true, // Automatically synchronize schema with entities (use migrations in production!)
      }),
    }),
    UserModule, // Import the UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
