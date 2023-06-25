import { Module } from '@nestjs/common';
import { CreateController } from './create.controller';
import { CreateService } from './create.service';
import { Game, GameDetails, GameDetailsScehema, GameSchema } from './schemas/create.schema';
import { MongooseModule } from '@nestjs/mongoose';

import { GameGateWay } from './socket/socket.game';
import { UserSchema } from 'src/modules/auth/schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports:[ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE'),
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{name:'Game',schema:GameSchema},{name:'GameDetails',schema:GameDetailsScehema}]),],
  controllers: [CreateController],
  providers: [CreateService,GameGateWay]
})
export class CreateModule {}
