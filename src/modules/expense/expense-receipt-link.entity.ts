import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ExpenseReceiptLink
 * -------------------
 * Links an ExpenseLine to one or more Document records.
 *
 * We keep this join table separate so that:
 * - A single receipt can be attached to multiple lines (if needed).
 * - A line can have multiple supporting documents.
 */
@Entity({ name: 'expense_receipt_links' })
export class ExpenseReceiptLink extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_exp_receipt_tenant_id')
  tenantId!: string;

  @Column({ name: 'line_id', type: 'uuid' })
  @Index('idx_exp_receipt_line_id')
  lineId!: string;

  @Column({ name: 'document_id', type: 'uuid' })
  @Index('idx_exp_receipt_document_id')
  documentId!: string;
}
