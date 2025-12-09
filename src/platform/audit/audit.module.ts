import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditService } from './audit.service';

/**
 * AuditModule (platform)
 * ----------------------
 * Provides low-level logging services to record immutable audit trail entries.
 *
 * The higher-level Audit & Compliance module will build on this to provide
 * sampling, auditor portals, and evidence bundles.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService],
  exports: [AuditService]
})
export class AuditModule {}
