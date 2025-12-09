import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * CurrentUserPayload
 * ------------------
 * Shape of the `request.user` object as populated by JwtStrategy.
 */
export interface CurrentUserPayload {
  id: string;
  tenantId: string;
  email: string;
}

/**
 * CurrentUser decorator
 * ---------------------
 * Allows controller methods to access the authenticated user like this:
 *
 *   someMethod(@CurrentUser() user: CurrentUserPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): CurrentUserPayload | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as CurrentUserPayload | undefined;
  }
);
