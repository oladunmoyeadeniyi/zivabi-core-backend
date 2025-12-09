import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ApLineSplitHistory
 * -------------------
 * Tracks splits of invoice lines across GLs/dimensions.
 */
@Entity({ name: 'ap_line_split_history' })
export class ApLineSplitHistory extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_ap_split_tenant_id')
  tenantId!: string;

  @Column({ name: 'original_line_id', type: 'uuid' })
  @Index('idx_ap_split_orig_line_id')
  originalLineId!: string;

  @Column({ name: 'new_line_id', type: 'uuid' })
  @Index('idx_ap_split_new_line_id')
  newLineId!: string;

  @Column({ name: 'allocation_percent', type: 'numeric', precision: 5, scale: 2, nullable: true })
  allocationPercent: string | null = null;

  @Column({ name: 'allocation_amount_local', type: 'numeric', precision: 18, scale: 2, nullable: true })
  allocationAmountLocal: string | null = null;
}
