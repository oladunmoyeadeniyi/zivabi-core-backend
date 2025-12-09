import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * WorkflowStep
 * ------------
 * Represents a single step within a workflow instance, such as
 * "Pending LM Approval", "Pending Finance Review", etc.
 */
@Entity({ name: 'workflow_steps' })
export class WorkflowStep extends BaseEntity {
  @Column({ name: 'instance_id', type: 'uuid' })
  @Index('idx_workflow_step_instance_id')
  instanceId!: string;

  /**
   * stepOrder
   * ---------
   * Numeric position of the step in the workflow (0, 1, 2, ...).
   */
  @Column({ name: 'step_order', type: 'int' })
  stepOrder!: number;

  /**
   * roleKey
   * -------
   * Which role is expected to act on this step (e.g., 'LM', 'FINANCE_REVIEWER').
   */
  @Column({ name: 'role_key', type: 'varchar', length: 100 })
  roleKey!: string;

  /**
   * status
   * ------
   * Status of this individual step: PENDING, APPROVED, REJECTED, SKIPPED, etc.
   */
  @Column({ type: 'varchar', length: 50 })
  status!: string;

  /**
   * actedByUserId
   * --------------
   * User who approved/rejected this step (if any).
   */
  @Column({ name: 'acted_by_user_id', type: 'uuid', nullable: true })
  actedByUserId: string | null = null;

  /**
   * actedAt
   * -------
   * Timestamp when the step was completed (if any).
   */
  @Column({ name: 'acted_at', type: 'timestamptz', nullable: true })
  actedAt: Date | null = null;

  /**
   * comment
   * -------
   * Optional comment left by the approver/reviewer.
   */
  @Column({ type: 'text', nullable: true })
  comment: string | null = null;
}
