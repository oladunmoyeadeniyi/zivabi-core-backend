import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsService } from './tenants.service';
import { Tenant } from './tenant.entity';

/**
 * TenantsModule
 * -------------
 * This module will handle tenant-level concerns for Ziva BI.
 *
 * A "tenant" is a company or organization using the platform.
 * Each tenant has its own configuration, data segregation rules, and
 * module subscriptions (e.g., Expense, AP, AR, Audit).
 */
@Module({
  imports: [
    // Register the Tenant entity with TypeORM so TenantsService
    // can inject a Repository<Tenant> and talk to the database.
    TypeOrmModule.forFeature([Tenant])
  ],
  providers: [TenantsService],
  exports: [TenantsService]
})
export class TenantsModule {}
