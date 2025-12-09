import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health/health.controller';
import { UsersModule } from './platform/users/users.module';
import { TenantsModule } from './platform/tenants/tenants.module';
import { AuthModule } from './platform/auth/auth.module';
import { RbacModule } from './platform/rbac/rbac.module';
import { DocumentsModule } from './platform/documents/documents.module';
import { WorkflowModule } from './platform/workflow/workflow.module';
import { DimensionsModule } from './platform/dimensions/dimensions.module';
import { AuditModule } from './platform/audit/audit.module';
import { AiModule } from './platform/ai/ai.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { ApModule } from './modules/ap/ap.module';
import { databaseConfig } from './config/database.config';
import { DevModule } from './dev/dev.module';

/**
 * AppModule is the ROOT module for the Ziva BI core backend.
 *
 * In NestJS, a "module" is a logical group of:
 *  - controllers (HTTP routes)
 *  - providers/services (business logic)
 *  - imported sub-modules
 *
 * This root module wires together the first platform-level building blocks:
 *  - ConfigModule + TypeOrmModule for environment config and database access.
 *  - HealthController for basic liveness checks.
 *  - UsersModule for basic user abstractions.
 *  - TenantsModule for multi-tenant context.
 *  - AuthModule as the placeholder for future authentication logic.
 *  - RbacModule to manage roles/permissions and protect routes.
 *  - DevModule containing development-only helpers such as seeding.
 *
 * Later we will also import:
 *  - Business domain modules such as AP, AR, BankRec, Payroll, etc.
 */
@Module({
  imports: [
    // ConfigModule loads environment variables (e.g., DATABASE_URL) and makes
    // them available throughout the application.
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeOrmModule connects NestJS to PostgreSQL using the databaseConfig
    // helper, which knows about our entities (Tenant, User, etc.).
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig()
    }),

    UsersModule,
    TenantsModule,
    AuthModule,
    RbacModule,
    DocumentsModule,
    WorkflowModule,
    DimensionsModule,
    AuditModule,
    AiModule,

    // First business domain module we implement: Expense Management.
    ExpenseModule,

    // Second domain module: Accounts Payable (AP).
    ApModule,

    DevModule
  ],
  controllers: [
    HealthController
  ],
  providers: [
    // Global services/providers can be declared here (if any).
  ]
})
export class AppModule {}
