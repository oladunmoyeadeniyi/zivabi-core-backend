import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tenant } from '../tenants/tenant.entity';

/**
 * User
 * ----
 * Represents a single authenticated user of the Ziva BI platform.
 * Each user belongs to exactly one tenant (company), enforced by tenantId.
 *
 * NOTE:
 * - Passwords and credentials will be stored in a separate secure structure
 *   or module (e.g., AuthCredential entity) to keep concerns clean.
 */
@Entity({ name: 'users' })
export class User extends BaseEntity {
  /**
   * Email address used for login and communication.
   * Must be unique per tenant.
   */
  @Column({ type: 'varchar', length: 255 })
  @Index('idx_user_email_per_tenant', { unique: false })
  email!: string;

  /**
   * displayName
   * -----------
   * Human-friendly name shown in the UI.
   */
  @Column({ name: 'display_name', type: 'varchar', length: 255 })
  displayName!: string;

  /**
   * passwordHash
   * ------------
   * Hashed password for local authentication.
   *
   * IMPORTANT:
   * - Plaintext passwords are NEVER stored.
   * - We will use bcrypt to generate and verify this hash.
   */
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  /**
   * tenantId
   * --------
   * Foreign key reference to the tenant this user belongs to.
   * This is the core link for multi-tenant isolation at user level.
   */
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_user_tenant_id')
  tenantId!: string;

  /**
   * tenant
   * ------
   * The full Tenant object (optional when loading from the database).
   *
   * Many users belong to one tenant (ManyToOne relation).
   */
  @ManyToOne(() => Tenant, { nullable: false })
  @JoinColumn({ name: 'tenant_id' })
  tenant!: Tenant;

  /**
   * isActive
   * --------
   * Indicates whether the user account is enabled.
   * If false, login should be blocked.
   */
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;
}
