import { Module } from '@nestjs/common';
import { CointossController } from './cointoss.controller';
import {  CointossService } from './cointoss.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookSchema } from 'src/modules/book/schemas/book.schema';
import { User, UserSchema } from 'src/modules/auth/schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from 'src/modules/auth/socket.gateway';

@Module({
  // imports:[MongooseModule.forFeature([{name:'Book',schema:BookSchema}])],
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
     MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
   ],
  controllers: [CointossController],
  providers: [CointossService]
})
export class CointossModule {

}
