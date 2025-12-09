import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 * ------------
 * Simple wrapper around Passport's built-in JWT authentication guard.
 *
 * Usage example:
 *
 *  @UseGuards(JwtAuthGuard)
 *  @Get('/protected')
 *  findSomething() { ... }
 *
 * It will:
 * - Extract and verify the JWT from the Authorization header.
 * - Attach the validated payload to request.user (see JwtStrategy.validate).
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
