import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * Tenant
 * ------
 * Represents a single company or organization using Ziva BI.
 *
 * Important notes:
 * - Every business record (users, expenses, invoices, etc.) will be linked
 *   to a tenant via a "tenantId" field.
 * - This is how we enforce multi-tenant data isolation at the database level.
 */
@Entity({ name: 'tenants' })
export class Tenant extends BaseEntity {
  /**
   * A short, human-readable tenant name.
   * Example: "Red Bull Nigeria", "Demo Tenant 1".
   */
  @Column({ type: 'varchar', length: 255 })
  @Index({ unique: true })
  name!: string;

  /**
   * isActive
   * --------
   * If false, the tenant is considered disabled:
   * - Users from this tenant should not be able to log in.
   * - Background jobs for this tenant may be paused.
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  /**
   * configJson
   * ----------
   * A flexible JSON column that will store high-level tenant configuration
   * (enabled modules, feature flags, defaults, etc.).
   *
   * We will later introduce strongly-typed tables for critical configuration,
   * but this gives us a safe and extensible starting point.
   */
  @Column({ name: 'config_json', type: 'jsonb', nullable: true })
  configJson: Record<string, any> | null = null;
}
