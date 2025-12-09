import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ApInvoiceLine
 * -------------
 * Represents a single line on an AP invoice.
 */
@Entity({ name: 'ap_invoice_lines' })
export class ApInvoiceLine extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_ap_line_tenant_id')
  tenantId!: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  @Index('idx_ap_line_invoice_id')
  invoiceId!: string;

  @Column({ name: 'line_number', type: 'int' })
  lineNumber!: number;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string | null = null;

  @Column({ name: 'amount_fx', type: 'numeric', precision: 18, scale: 2 })
  amountFx!: string;

  @Column({ name: 'amount_local', type: 'numeric', precision: 18, scale: 2 })
  amountLocal!: string;

  // Basic accounting fields (will be expanded similar to ExpenseLine)
  @Column({ name: 'gl_code', type: 'varchar', length: 20, nullable: true })
  glCode: string | null = null;

  @Column({ name: 'pl_group', type: 'varchar', length: 20, nullable: true })
  plGroup: string | null = null;

  @Column({ name: 'pl_line', type: 'varchar', length: 100, nullable: true })
  plLine: string | null = null;
}
