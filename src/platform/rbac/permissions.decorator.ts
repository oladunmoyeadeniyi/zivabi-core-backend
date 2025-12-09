import { SetMetadata } from '@nestjs/common';

/**
 * PERMISSIONS_KEY
 * ---------------
 * Metadata key under which we store required permissions on route handlers.
 */
export const PERMISSIONS_KEY = 'required_permissions';

/**
 * Permissions decorator
 * ---------------------
 * Usage example:
 *
 *  @Permissions('expense.submit', 'expense.view')
 *  @Get('/my-expenses')
 *  findMyExpenses() { ... }
 *
 * The RbacGuard (defined separately) will read this metadata and use
 * RbacService to verify whether the current user has at least one of
 * the specified permissions.
 */
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
