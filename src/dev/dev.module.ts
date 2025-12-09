import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../platform/tenants/tenant.entity';
import { User } from '../platform/users/user.entity';
import { RbacModule } from '../platform/rbac/rbac.module';
import { DevSeedController } from './dev-seed.controller';

/**
 * DevModule
 * ---------
 * This module groups together development-only helpers.
 *
 * IMPORTANT:
 * - Any controllers or services here should be protected by environment
 *   variables so they cannot be abused in production accidentally.
 * - Example: a seeding endpoint to create an initial admin user.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, User]),
    RbacModule
  ],
  controllers: [DevSeedController]
})
export class DevModule {}
