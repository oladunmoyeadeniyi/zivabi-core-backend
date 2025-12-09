import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * WorkflowInstance
 * ----------------
 * Represents a single running workflow attached to a business entity.
 *
 * Example: an ExpenseRequest or AP invoice approval chain in progress.
 */
@Entity({ name: 'workflow_instances' })
export class WorkflowInstance extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_workflow_inst_tenant_id')
  tenantId!: string;

  @Column({ name: 'definition_id', type: 'uuid' })
  @Index('idx_workflow_inst_definition_id')
  definitionId!: string;

  /**
   * ownerType/ownerId
   * ------------------
   * Identify the business record this workflow instance is attached to.
   */
  @Column({ name: 'owner_type', type: 'varchar', length: 100 })
  ownerType!: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  /**
   * status
   * ------
   * Overall status of the workflow instance: DRAFT, IN_PROGRESS, COMPLETED,
   * REJECTED, CANCELLED, etc. We will refine the exact values later.
   */
  @Column({ type: 'varchar', length: 50 })
  status!: string;
}
