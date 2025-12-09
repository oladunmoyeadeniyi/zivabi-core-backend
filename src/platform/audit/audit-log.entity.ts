import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * AuditLog
 * --------
 * Low-level, immutable audit trail entry used across all modules.
 *
 * Higher-level Audit & Compliance module will build on top of this
 * to provide auditor portals, sampling, evidence bundles, etc.
 */
@Entity({ name: 'audit_logs' })
export class AuditLog extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_audit_tenant_id')
  tenantId!: string;

  /**
   * entityType / entityId
   * ---------------------
   * Identify which record this audit entry refers to.
   * Example: entityType = 'ExpenseRequest', entityId = '...uuid...'
   */
  @Column({ name: 'entity_type', type: 'varchar', length: 100 })
  @Index('idx_audit_entity_type')
  entityType!: string;

  @Column({ name: 'entity_id', type: 'uuid' })
  @Index('idx_audit_entity_id')
  entityId!: string;

  /**
   * action
   * ------
   * Short code describing what happened, e.g. 'CREATED', 'UPDATED',
   * 'APPROVED', 'REJECTED', 'POSTED', etc.
   */
  @Column({ name: 'action', type: 'varchar', length: 50 })
  action!: string;

  /**
   * actorUserId
   * -----------
   * Which user performed the action (if any).
   */
  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId: string | null = null;

  /**
   * before / after
   * --------------
   * JSON snapshots of the data before and after the change.
   * For non-change events (like APPROVED), "before" or "after" may be null.
   */
  @Column({ name: 'before_data', type: 'jsonb', nullable: true })
  beforeData: Record<string, any> | null = null;

  @Column({ name: 'after_data', type: 'jsonb', nullable: true })
  afterData: Record<string, any> | null = null;

  /**
   * metadata
   * --------
   * Extra contextual information (IP address, correlationId, etc.).
   */
  @Column({ name: 'metadata', type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null = null;
}
