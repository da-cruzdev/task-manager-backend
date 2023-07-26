import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refreshToken') {
  constructor() {
    super();
  }

  getRequest<T = any>(context: ExecutionContext): T {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
