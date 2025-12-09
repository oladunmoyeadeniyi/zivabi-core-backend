import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * DimensionType
 * -------------
 * Describes a type of dimension (e.g., REAL_IO, STAT_IO, COST_CENTER, MATERIAL_IO, LOCATION).
 */
@Entity({ name: 'dimension_types' })
export class DimensionType extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_dim_type_tenant_id')
  tenantId!: string;

  @Column({ name: 'key', type: 'varchar', length: 50 })
  @Index('idx_dim_type_key_per_tenant')
  key!: string;

  @Column({ name: 'display_name', type: 'varchar', length: 100 })
  displayName!: string;
}
