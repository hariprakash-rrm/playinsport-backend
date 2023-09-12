import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      const decodedToken = this.jwtService.verify(token);
      const user = decodedToken.user; // Assuming your user information is stored in the 'user' property of the JWT payload.

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
