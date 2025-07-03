// src/main.ts (in your NestJS project)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Import ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- ADD THIS LINE
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })); // Add this line for DTO validation
  await app.listen(3000);
}
bootstrap();
