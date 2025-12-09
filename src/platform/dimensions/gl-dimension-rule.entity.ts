import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * GlDimensionRule
 * ----------------
 * Defines which dimensions are required or optional for a given GL account.
 */
@Entity({ name: 'gl_dimension_rules' })
export class GlDimensionRule extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_gl_dim_rule_tenant_id')
  tenantId!: string;

  @Column({ name: 'gl_code', type: 'varchar', length: 20 })
  @Index('idx_gl_dim_rule_gl_code')
  glCode!: string;

  /**
   * requiredDimensionKeys
   * ---------------------
   * JSON array of dimension type keys that are mandatory for this GL code.
   * Example: ['REAL_IO', 'COST_CENTER']
   */
  @Column({ name: 'required_dimension_keys', type: 'jsonb', nullable: true })
  requiredDimensionKeys: string[] | null = null;

  /**
   * optionalDimensionKeys
   * ---------------------
   * JSON array of dimension type keys that are allowed but not required.
   */
  @Column({ name: 'optional_dimension_keys', type: 'jsonb', nullable: true })
  optionalDimensionKeys: string[] | null = null;
}
