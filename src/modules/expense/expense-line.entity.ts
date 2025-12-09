import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ExpenseLine
 * -----------
 * Represents a single line item in an ExpenseRequest, capturing
 * GL + dimension choices and invoice/receipt-level details.
 */
@Entity({ name: 'expense_lines' })
export class ExpenseLine extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_exp_line_tenant_id')
  tenantId!: string;

  @Column({ name: 'request_id', type: 'uuid' })
  @Index('idx_exp_line_request_id')
  requestId!: string;

  @Column({ name: 'line_number', type: 'int' })
  lineNumber!: number;

  // --- Accounting classification fields (PL group, GL, dimensions) ---

  @Column({ name: 'pl_group', type: 'varchar', length: 20, nullable: true })
  plGroup: string | null = null;

  @Column({ name: 'pl_line', type: 'varchar', length: 100, nullable: true })
  plLine: string | null = null;

  @Column({ name: 'gl_code', type: 'varchar', length: 20, nullable: true })
  glCode: string | null = null;

  @Column({ name: 'real_io_code', type: 'varchar', length: 50, nullable: true })
  realIoCode: string | null = null;

  @Column({ name: 'stat_io_code', type: 'varchar', length: 50, nullable: true })
  statIoCode: string | null = null;

  @Column({ name: 'cost_center_code', type: 'varchar', length: 50, nullable: true })
  costCenterCode: string | null = null;

  @Column({ name: 'material_io_code', type: 'varchar', length: 50, nullable: true })
  materialIoCode: string | null = null;

  @Column({ name: 'location', type: 'varchar', length: 100, nullable: true })
  location: string | null = null;

  // --- Invoice / receipt details ---

  @Column({ name: 'invoice_number', type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string | null = null;

  @Column({ name: 'invoice_date', type: 'date', nullable: true })
  invoiceDate: Date | null = null;

  @Column({ name: 'description', type: 'varchar', length: 500, nullable: true })
  description: string | null = null;

  @Column({ name: 'amount', type: 'numeric', precision: 18, scale: 2 })
  amount!: string;

  @Column({ name: 'currency', type: 'varchar', length: 10 })
  currency!: string;

  @Column({ name: 'vat_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  vatAmount!: string;

  /**
   * ocrConfidence
   * -------------
   * Confidence score (0–100) from OCR extraction; used for UI prompts.
   */
  @Column({ name: 'ocr_confidence', type: 'int', default: 0 })
  ocrConfidence!: number;

  /**
   * duplicateSuspected
   * -------------------
   * Marks whether this line has been flagged by the duplicate detection
   * engine for Finance review.
   */
  @Column({ name: 'duplicate_suspected', type: 'boolean', default: false })
  duplicateSuspected!: boolean;
}
