import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe)
  // const app = await NestFactory.create(ApplicationModule);
app.enableCors();

  await app.listen(3000);
}
bootstrap();
