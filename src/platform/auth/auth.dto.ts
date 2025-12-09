import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * LoginDto
 * --------
 * Describes the shape of the data expected when a user tries to log in.
 *
 * The ValidationPipe configured in main.ts will automatically validate
 * incoming requests against this DTO when used in a controller method.
 */
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}

/**
 * AuthTokenResponse
 * -----------------
 * Response returned by the login endpoint.
 *
 * For now, we only send back a single JWT accessToken. Later, we may
 * add a refreshToken and additional metadata.
 */
export class AuthTokenResponse {
  accessToken!: string;
}
