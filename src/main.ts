import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

/**
 * This is the MAIN entry point of the Ziva BI core backend.
 *
 * Think of this file as the "engine starter" for the whole platform.
 * - It creates the NestJS application.
 * - It applies global settings (validation, security defaults, logging).
 * - It starts listening on a TCP port (for HTTP API requests).
 *
 * Every request from the frontend, vendor portal, mobile app, etc.
 * will eventually reach this NestJS application created here.
 */
async function bootstrap() {
  // We use a NestJS logger to print consistent logs to the console.
  const logger = new Logger('Bootstrap');

  // Create the NestJS application using the root AppModule.
  // AppModule will later import all other modules (auth, tenants, expense, ap, etc.).
  const app = await NestFactory.create(AppModule);

  // Enable CORS so that the Next.js frontend (running on a different origin)
  // can safely call this backend API from the browser.
  app.enableCors({
    origin: '*', // NOTE: for production, we will replace '*' with specific allowed domains per tenant.
    credentials: false
  });

  // Add a global validation pipe:
  // - It automatically validates incoming request DTOs.
  // - It strips unknown properties (for security).
  // - It converts primitive types (e.g., string to number) when safe.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that are not in the DTO class
      forbidNonWhitelisted: true, // throw an error if unknown properties are present
      transform: true // transform payloads to DTO instances
    })
  );

  // PORT:
  // - We default to 3000.
  // - Render and other hosts usually inject PORT via environment variable.
  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`Ziva BI core backend is running on http://localhost:${port}`);
}

// Start the application.
bootstrap();
