import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * Role
 * ----
 * Represents a high-level role in the RBAC system, such as:
 * - EMPLOYEE, LM, HOD, GM, FINANCE_REVIEWER, FINANCE_APPROVER,
 *   TENANT_ADMIN, SUPER_ADMIN, VENDOR, AUDITOR, etc.
 *
 * Roles are tenant-aware: the same role key may exist in multiple tenants,
 * allowing per-tenant customization while still supporting some global roles.
 */
@Entity({ name: 'rbac_roles' })
export class Role extends BaseEntity {
  /**
   * tenantId
   * --------
   * The tenant this role belongs to.
   * For global roles (e.g., SUPER_ADMIN), we may use a reserved tenant id
   * such as 'global'.
   */
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_role_tenant_id')
  tenantId!: string;

  /**
   * key
   * ---
   * Machine-readable identifier for the role.
   * Example: 'EMPLOYEE', 'FINANCE_REVIEWER', 'TENANT_ADMIN'.
   */
  @Column({ type: 'varchar', length: 100 })
  @Index('idx_role_key_per_tenant', { unique: false })
  key!: string;

  /**
   * displayName
   * -----------
   * Human-friendly name that can be shown in the UI.
   */
  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName!: string;

  /**
   * description
   * -----------
   * Optional longer description of what this role is used for.
   */
  @Column({ type: 'text', nullable: true })
  description: string | null = null;
}
