import { Module } from "@nestjs/common";
import { ExchangeController } from "./exchange.controller";
import { ExchangeService } from "./exchange.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ExchangeSchema } from "./schemas/exchange.schema";
import { JwtStrategy } from "src/modules/auth/jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserSchema } from "src/modules/auth/schemas/user.schema";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "src/modules/auth/auth.service";

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
      { name: "Exchange", schema: ExchangeSchema },
    ]),
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService, AuthService],
  exports: [],
})
export class ExchangeModule {}
