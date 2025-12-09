import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * FinanceReviewRecord
 * --------------------
 * Captures edits made by Finance during review (GL changes, dimension fixes,
 * VAT adjustments, etc.), together with who made the change.
 */
@Entity({ name: 'expense_finance_reviews' })
export class FinanceReviewRecord extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_fin_review_tenant_id')
  tenantId!: string;

  @Column({ name: 'line_id', type: 'uuid' })
  @Index('idx_fin_review_line_id')
  lineId!: string;

  @Column({ name: 'field_changed', type: 'varchar', length: 100 })
  fieldChanged!: string;

  @Column({ name: 'old_value', type: 'text', nullable: true })
  oldValue: string | null = null;

  @Column({ name: 'new_value', type: 'text', nullable: true })
  newValue: string | null = null;

  @Column({ name: 'finance_user_id', type: 'uuid', nullable: true })
  financeUserId: string | null = null;
}
