import { Module } from '@nestjs/common';
import { UserController, _UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../auth/schemas/user.schema';
import { GameDetailsScehema, GameSchema } from '../games/create/schemas/create.schema';
import { ExcelService } from '../shared/excelService';
import { DepositWalletSchema, TotalSupplySchema, WithdrawWalletSchema } from '../auth/schemas/wallet.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>("JWT_SECRET"),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRE"),
          },
        };
      },
    }),
    MongooseModule.forFeature([
      { name: "User", schema: UserSchema },
      { name: "Game", schema: GameSchema },
      { name: "DepositWallet", schema: DepositWalletSchema },
      { name: "GameDetails", schema: GameDetailsScehema },
      { name: "WithdrawWallet", schema: WithdrawWalletSchema },
      { name: "TotalSupply", schema: TotalSupplySchema }
    ]),
  ],
  controllers: [UserController,_UserController],
  providers: [UserService, AuthService, ExcelService],
})
export class UserModule { }
