import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // Check if the user is an admin (assuming isAdmin is a boolean property in the user object).
    if (user && user.isAdmin === true) {
      return true;
    }

    throw new UnauthorizedException('Login as Admin')
  }
}
