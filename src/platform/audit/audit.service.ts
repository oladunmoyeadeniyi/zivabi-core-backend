import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

/**
 * AuditService
 * ------------
 * Simple helper for writing audit trail entries.
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>
  ) {}

  /**
   * logEvent
   * --------
   * Records an audit log entry.
   */
  async logEvent(params: {
    tenantId: string;
    entityType: string;
    entityId: string;
    action: string;
    actorUserId?: string | null;
    beforeData?: Record<string, any> | null;
    afterData?: Record<string, any> | null;
    metadata?: Record<string, any> | null;
  }): Promise<AuditLog> {
    const entry = this.auditRepo.create({
      tenantId: params.tenantId,
      entityType: params.entityType,
      entityId: params.entityId,
      action: params.action,
      actorUserId: params.actorUserId ?? null,
      beforeData: params.beforeData ?? null,
      afterData: params.afterData ?? null,
      metadata: params.metadata ?? null
    });
    return this.auditRepo.save(entry);
  }
}
