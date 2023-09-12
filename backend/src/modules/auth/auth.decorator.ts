import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './schemas/user.schema'; // Correct the import path

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
