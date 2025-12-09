import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, AuthTokenResponse } from './auth.dto';

/**
 * AuthController
 * --------------
 * Exposes HTTP endpoints for authentication flows.
 *
 * For now, we only implement a simple login endpoint:
 * - POST /auth/login -> returns a JWT access token when credentials are valid.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * -----------------
   * Request body: { email: string, password: string }
   * Response: { accessToken: string }
   */
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<AuthTokenResponse> {
    return this.authService.login(dto.email, dto.password);
  }
}
