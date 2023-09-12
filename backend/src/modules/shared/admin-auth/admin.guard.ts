import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    // Check if the user is an admin (assuming isAdmin is a boolean property in the user object).
    if (user && user.isAdmin === true) {
      return true;
    }

    return false;
  }
}
