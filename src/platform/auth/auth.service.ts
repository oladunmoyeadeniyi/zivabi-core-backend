import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { AuthTokenResponse } from './auth.dto';

/**
 * AuthService
 * -----------
 * Handles all authentication-related business logic:
 * - Validating user credentials.
 * - Generating JWT access tokens.
 * - (Later) supporting refresh tokens and SSO providers.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * validateUser
   * ------------
   *
   * Checks whether the provided email/password combination matches a user
   * stored in the database. If valid, returns the User entity; otherwise
   * returns null.
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    // Compare the plaintext password with the stored bcrypt hash.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return null;
    }

    return user;
  }

  /**
   * login
   * -----
   *
   * Given valid credentials, issues a signed JWT access token containing the
   * essential user identity data (id, tenantId, email).
   */
  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      // We deliberately do not reveal whether the email or password was wrong
      // to avoid leaking information to attackers.
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
