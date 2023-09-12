import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,@InjectModel(User.name)
  private userModel: Model<User>,) {}

   canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    // Extract the token from the "Authorization" header
    const token = authorizationHeader.split(' ')[1];

    // Validate the token
    try {
        const user:any =  this.userModel.findOne({ token: token });
     
      if (user && user.isAdmin === true) {
        // The user is an admin, so allow access.
        return true;
      } else {
        throw new UnauthorizedException('Unauthorized: Only admin users allowed');
      }
    } catch (error) {
      throw new UnauthorizedException('Authentication token invalid');
    }
  }
}
