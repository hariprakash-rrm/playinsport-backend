import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.get<boolean>('isAdmin', context.getHandler());

    if (isAdmin) {
      // Admins are allowed to access this route.
      return true;
    }

    // Get the request object from the ExecutionContext
    const request = context.switchToHttp().getRequest();

    // Check if the Authorization header is present
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // The Authorization header is missing or doesn't start with 'Bearer '
      return false;
    }

    // Extract the token from the header
    const token = authorizationHeader.split(' ')[1];

    // You can add your token validation logic here.
    // For example, you can validate the token against your authentication service.

    // If the token is valid, you can return true; otherwise, return false.

    // Example:
    // const isValidToken = validateToken(token);
    // if (!isValidToken) {
    //   return false;
    // }

    return true;
  }
}
