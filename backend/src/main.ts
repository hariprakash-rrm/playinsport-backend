import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { env } from 'process';
require("dotenv").config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Cats Example')
    .setDescription('The Cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useWebSocketAdapter(new IoAdapter(app));
  // app.useWebSocketAdapter(new IoAdapter(app));

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
    credentials: true, // Allow sending cookies and other credentials
  };
 
  app.enableCors(corsOptions);
  await app.listen(3000);
}
bootstrap();
