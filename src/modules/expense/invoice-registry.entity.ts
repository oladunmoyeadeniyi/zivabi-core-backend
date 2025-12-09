import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * InvoiceRegistry
 * ---------------
 * Central registry of all invoices used in expense retirements, to help
 * detect duplicates across requests.
 */
@Entity({ name: 'expense_invoice_registry' })
export class InvoiceRegistry extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_invreg_tenant_id')
  tenantId!: string;

  @Column({ name: 'invoice_number_normalized', type: 'varchar', length: 150 })
  @Index('idx_invreg_invoice_number')
  invoiceNumberNormalized!: string;

  @Column({ name: 'vendor_name', type: 'varchar', length: 255, nullable: true })
  vendorName: string | null = null;

  @Column({ name: 'invoice_date', type: 'date', nullable: true })
  invoiceDate: Date | null = null;

  @Column({ name: 'amount', type: 'numeric', precision: 18, scale: 2, nullable: true })
  amount: string | null = null;

  @Column({ name: 'currency', type: 'varchar', length: 10, nullable: true })
  currency: string | null = null;

  @Column({ name: 'document_hash', type: 'char', length: 64, nullable: true })
  documentHash: string | null = null;

  @Column({ name: 'perceptual_hash', type: 'varchar', length: 128, nullable: true })
  perceptualHash: string | null = null;

  @Column({ name: 'ocr_text_hash', type: 'char', length: 64, nullable: true })
  ocrTextHash: string | null = null;

  @Column({ name: 'linked_request_id', type: 'uuid', nullable: true })
  linkedRequestId: string | null = null;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'USED' })
  status!: string;
}
