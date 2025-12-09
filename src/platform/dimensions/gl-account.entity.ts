import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * GlAccount
 * ---------
 * Represents a single GL account in the tenant's chart of accounts.
 */
@Entity({ name: 'gl_accounts' })
export class GlAccount extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_gl_tenant_id')
  tenantId!: string;

  @Column({ name: 'code', type: 'varchar', length: 20 })
  @Index('idx_gl_code_per_tenant')
  code!: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  /**
   * plGroup / plLine
   * ----------------
   * High-level mapping to PL structure (PL1..PL4, etc.).
   */
  @Column({ name: 'pl_group', type: 'varchar', length: 20, nullable: true })
  plGroup: string | null = null;

  @Column({ name: 'pl_line', type: 'varchar', length: 100, nullable: true })
  plLine: string | null = null;
}
