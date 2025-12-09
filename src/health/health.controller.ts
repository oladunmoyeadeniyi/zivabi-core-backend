import { Controller, Get } from '@nestjs/common';

/**
 * HealthController
 * -----------------
 * This tiny controller exposes a simple GET /health endpoint.
 *
 * Purpose:
 * - Allow you, Render, and monitoring tools to quickly check if the
 *   Ziva BI backend is running and able to respond to HTTP requests.
 * - Later, we can extend this to check dependencies (database, storage, AI service, etc.).
 */
@Controller('health')
export class HealthController {
  /**
   * GET /health
   * Returns a very small JSON object that indicates the service is alive.
   *
   * In production, external uptime monitors can ping this endpoint.
   */
  @Get()
  getHealth() {
    return {
      status: 'ok',
      service: 'zivabi-core-backend',
      // A static version string for now; later we can inject build/version info here.
      version: '0.1.0'
    };
  }
}
