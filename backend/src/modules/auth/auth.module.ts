import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { JwtStrategy } from './jwt.strategy';
import { UserSchema } from './schemas/user.schema';
import { JwtStrategy } from './jwt.strategy';
import { ChatGateway } from './socket.gateway';
import { GameSchema } from '../games/create/schemas/create.schema';
require("dotenv").config();
@Module({
  imports: [
   ConfigModule,
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
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema },{name:'Game',schema:GameSchema}]),
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,ChatGateway],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}