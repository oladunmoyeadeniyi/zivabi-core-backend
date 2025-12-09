import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * DimensionValue
 * --------------
 * Represents a specific value of a dimension (e.g., a particular cost center or IO).
 */
@Entity({ name: 'dimension_values' })
export class DimensionValue extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_dim_val_tenant_id')
  tenantId!: string;

  @Column({ name: 'dimension_type_key', type: 'varchar', length: 50 })
  @Index('idx_dim_val_type_key')
  dimensionTypeKey!: string;

  @Column({ name: 'code', type: 'varchar', length: 50 })
  @Index('idx_dim_val_code_per_type_tenant')
  code!: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;
}
