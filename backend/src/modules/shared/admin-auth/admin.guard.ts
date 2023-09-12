import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      
      if (!authorizationHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }

      const [bearer, token] = authorizationHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid Authorization header format');
      }

      const admin = await this.userModel.findOne({ token });

      if (!admin) {
        throw new UnauthorizedException('User not found');
      }

      if (!admin.isAdmin) {
        throw new UnauthorizedException('Login as admin to access this endpoint.');
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}
