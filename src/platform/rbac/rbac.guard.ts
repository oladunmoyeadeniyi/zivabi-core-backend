import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './permissions.decorator';
import { RbacService } from './rbac.service';

/**
 * RbacGuard
 * ---------
 * This guard checks whether the current user has the permissions required
 * by the route handler (set via the @Permissions() decorator).
 *
 * NOTE: For now, it assumes that the request object already has a
 * `user` property with at least an `id` field. Later, the AuthModule will
 * populate this user from a validated JWT token.
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Read required permissions from metadata on the handler or class.
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? [];

    // If no specific permissions were set, allow access by default.
    if (requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { id?: string } | undefined;

    // If no user is present, the AuthGuard (still to be implemented) should
    // normally have blocked the request already. Here we simply deny access.
    if (!user || !user.id) {
      return false;
    }

    // Ask the RBAC service if the user has any of the required permissions.
    return this.rbacService.userHasAnyPermission(user.id, requiredPermissions);
  }
}
