import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * WorkflowDefinition
 * ------------------
 * Represents a reusable workflow template for a module.
 *
 * Example: 'expense.standard-approval', 'ap.invoice-3level', etc.
 */
@Entity({ name: 'workflow_definitions' })
export class WorkflowDefinition extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_workflow_def_tenant_id')
  tenantId!: string;

  /**
   * key
   * ---
   * Machine-readable identifier for the workflow definition.
   */
  @Column({ type: 'varchar', length: 150 })
  @Index('idx_workflow_def_key')
  key!: string;

  /**
   * module
   * ------
   * Which high-level module this workflow belongs to (e.g., 'expense', 'ap').
   */
  @Column({ type: 'varchar', length: 50 })
  module!: string;

  /**
   * configJson
   * ----------
   * JSON blob storing the workflow steps, roles, transitions, and SLAs.
   * Later we will formalize this structure, but JSON is flexible for now.
   */
  @Column({ name: 'config_json', type: 'jsonb' })
  configJson!: Record<string, any>;
}
