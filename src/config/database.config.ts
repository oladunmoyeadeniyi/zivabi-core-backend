import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * databaseConfig
 * --------------
 * This helper function builds the TypeORM configuration for connecting
 * to the PostgreSQL database used by Ziva BI.
 *
 * We keep it in one place so that:
 * - The AppModule can import it cleanly.
 * - Future scripts (migrations, CLI tools) can reuse the exact same settings.
 */
export function databaseConfig(): TypeOrmModuleOptions {
  // DATABASE_URL is a single connection string. Example:
  // postgres://username:password@host:5432/zivabi
  //
  // For local development, you can also define individual env vars instead
  // (not shown here to keep things simple).
  const url = process.env.DATABASE_URL;

  if (!url) {
    // For now we throw an error if no DB URL is set.
    // On Render, you will configure DATABASE_URL in the service settings.
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  const isProd = process.env.NODE_ENV === 'production';

  return {
    type: 'postgres',
    url,
    // IMPORTANT:
    // -----------
    // We load ALL entity classes from the compiled dist folder so that
    // modules such as RBAC, Workflow, Expense, AP, Audit, Documents, etc.
    // are all included automatically. This keeps the configuration
    // maintainable as the system grows.
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    // synchronize: true will auto-create tables based on entities.
    // This is VERY convenient during early development but must be disabled
    // for real production migrations.
    synchronize: !isProd,
    logging: !isProd,
    // For Render and cloud Postgres, SSL may be required; we keep this flexible.
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
}
