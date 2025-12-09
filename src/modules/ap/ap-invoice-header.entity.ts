import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ApInvoiceHeader
 * ---------------
 * Represents a single vendor invoice in the AP module.
 */
@Entity({ name: 'ap_invoice_headers' })
export class ApInvoiceHeader extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_ap_inv_tenant_id')
  tenantId!: string;

  @Column({ name: 'vendor_id', type: 'varchar', length: 100 })
  vendorId!: string;

  @Column({ name: 'invoice_number', type: 'varchar', length: 150 })
  @Index('idx_ap_inv_invoice_number')
  invoiceNumber!: string;

  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate!: Date;

  @Column({ name: 'currency', type: 'varchar', length: 10 })
  currency!: string;

  @Column({ name: 'amount_fx', type: 'numeric', precision: 18, scale: 2 })
  amountFx!: string;

  @Column({ name: 'amount_local', type: 'numeric', precision: 18, scale: 2 })
  amountLocal!: string;

  @Column({ name: 'fx_rate_used', type: 'numeric', precision: 18, scale: 6 })
  fxRateUsed!: string;

  /**
   * status
   * ------
   * Lifecycle state: DRAFT, SUBMITTED, IN_APPROVAL, FINANCE_REVIEW,
   * APPROVED, POSTED, PAID, REJECTED, etc.
   */
  @Column({ name: 'status', type: 'varchar', length: 50 })
  status!: string;

  @Column({ name: 'workflow_instance_id', type: 'uuid', nullable: true })
  workflowInstanceId: string | null = null;
}
