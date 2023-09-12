import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from './schemas/user.schema';
import { env } from 'process';
require("dotenv").config();
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.JWT_SECRET
    });
  }

  async validateJwtUser(payload: any) {
    const userId = payload.sub;
    const user = await this.userModel.findOne({ where: { id: userId } }); // Use findOne with 'where'

    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    return user;
  }

  async validate(payload) {
    const { id } = payload;

    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Login first to access this endpoint.');
    }

    return user;
  }
  async adminValidate(payload) {
    const { token } = payload;

    const admin = await this.userModel.findOne({ token: token });

    if (!admin) {
      throw new UnauthorizedException('Login as admin to access this endpoint.');
    }

    return true;
  }
}