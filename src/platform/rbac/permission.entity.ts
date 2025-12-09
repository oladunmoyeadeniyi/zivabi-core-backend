import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * Permission
 * ----------
 * Represents a low-level capability such as:
 * - 'expense.submit', 'expense.approve', 'ap.invoice.review',
 *   'tenant.config.manage', 'audit.view', etc.
 *
 * Roles are tied to permissions via RolePermission mappings.
 */
@Entity({ name: 'rbac_permissions' })
export class Permission extends BaseEntity {
  /**
   * key
   * ---
   * Machine-readable identifier for the permission.
   * Example: 'expense.submit', 'ap.invoice.approve'.
   */
  @Column({ type: 'varchar', length: 150 })
  @Index('idx_permission_key', { unique: true })
  key!: string;

  /**
   * description
   * -----------
   * Optional human-readable explanation of what this permission allows.
   */
  @Column({ type: 'text', nullable: true })
  description: string | null = null;
}
