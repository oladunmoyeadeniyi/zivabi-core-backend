import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

/**
 * AuthModule
 * ----------
 * This module now wires together all authentication-related components:
 * - JwtModule for signing and verifying JWT tokens.
 * - PassportModule for integrating the JWT strategy.
 * - AuthService containing the business logic for validating users and
 *   issuing tokens.
 * - AuthController exposing HTTP endpoints (e.g., POST /auth/login).
 */
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        // JWT secret used to sign tokens. In production you MUST override
        // this with a strong secret via the JWT_SECRET environment variable.
        secret: process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION',
        signOptions: {
          // Access tokens are short-lived; we will issue refresh tokens later.
          expiresIn: '15m'
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
