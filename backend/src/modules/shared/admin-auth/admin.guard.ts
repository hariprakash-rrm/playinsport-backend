import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/modules/auth/schemas/user.schema';
import { UserModule } from 'src/modules/user/user.module';


@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name)
  private userModel: Model<User>,) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log(req.body,'Reqqqqqqqqqqqqqq')
    const { token } = req.body; // You might need to adjust this depending on your request structure

    try {
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
