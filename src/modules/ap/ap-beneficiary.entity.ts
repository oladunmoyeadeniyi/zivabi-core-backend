import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ApBeneficiary
 * -------------
 * Represents a beneficiary/employee allocation on an AP invoice line.
 */
@Entity({ name: 'ap_beneficiaries' })
export class ApBeneficiary extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_ap_benef_tenant_id')
  tenantId!: string;

  @Column({ name: 'line_id', type: 'uuid' })
  @Index('idx_ap_benef_line_id')
  lineId!: string;

  @Column({ name: 'beneficiary_name', type: 'varchar', length: 255 })
  beneficiaryName!: string;

  @Column({ name: 'allocation_percent', type: 'numeric', precision: 5, scale: 2, nullable: true })
  allocationPercent: string | null = null;

  @Column({ name: 'allocation_amount_local', type: 'numeric', precision: 18, scale: 2, nullable: true })
  allocationAmountLocal: string | null = null;
}
