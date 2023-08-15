import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './modules/book/book.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { CointossModule } from './modules/games/cointoss/cointoss.module';
import { CreateModule } from './modules/games/create/create.module';
import { UserModule } from './modules/user/user.module';
import { env } from 'process';
require("dotenv").config();

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forRoot(env.DB_URI),
    BookModule,
    CointossModule,
    CreateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
