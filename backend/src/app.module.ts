import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CointossModule } from './modules/games/cointoss/cointoss.module';
import { CreateModule } from './modules/games/create/create.module';


@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost:27017/quiz'),BookModule,CointossModule,CreateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
