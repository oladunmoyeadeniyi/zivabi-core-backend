import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategyBase } from 'passport-jwt';

/**
 * JwtPayload
 * ----------
 * Describes the structure of the data we embed inside JWT access tokens.
 */
export interface JwtPayload {
  sub: string; // user id
  tenantId: string;
  email: string;
}

/**
 * JwtStrategy
 * -----------
 * Passport strategy that knows how to:
 * - Read a JWT from the Authorization header.
 * - Verify it using the configured secret.
 * - Expose the decoded payload as `request.user`.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(JwtStrategyBase) {
  constructor() {
    super({
      // Tell Passport-JWT where to find the token in each HTTP request.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // In some environments we may not want to enforce "exp" automatically,
      // but for access tokens it is generally good to keep it enabled.
      ignoreExpiration: false,
      // Same secret as used by JwtModule in AuthModule.
      secretOrKey: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION'
    });
  }

  /**
   * validate
   * --------
   * If the token is valid, Passport will call this method with the decoded
   * payload. Whatever we return from here becomes `request.user`.
   */
  async validate(payload: JwtPayload) {
    // For now we simply return the payload; later we could enrich it with
    // fresh user data from the database if needed.
    return {
      id: payload.sub,
      tenantId: payload.tenantId,
      email: payload.email
    };
  }
}
