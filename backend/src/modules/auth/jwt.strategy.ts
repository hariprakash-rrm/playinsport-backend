import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./schemas/user.schema";
import { env } from "process";
import { AuthService } from "./auth.service";
require("dotenv").config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private authService:AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET,
    });
  }



  async validate(payload: any) {
    return this.authService.validateJwtUser(payload);
  }
  
  async adminValidate(payload) {
    const { token } = payload;

    const admin = await this.userModel.findOne({ token: token });

    if (!admin) {
      throw new UnauthorizedException(
        "Login as admin to access this endpoint."
      );
    }

    return true;
  }
}
