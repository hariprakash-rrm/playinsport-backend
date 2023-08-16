import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { env } from 'process';
require("dotenv").config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: env.api_url, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
    credentials: true, // Allow sending cookies and other credentials
  };
 
  app.enableCors(corsOptions);
  await app.listen(3001);
}
bootstrap();
