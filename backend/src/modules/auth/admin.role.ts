import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming your user object contains an 'isAdmin' property

    if (!user || !user.isAdmin) {
      return false; // User is not an admin, deny access
    }

    return true; // User is an admin, allow access
  }
}
