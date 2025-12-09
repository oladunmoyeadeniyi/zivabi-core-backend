import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * AdvanceRecord
 * -------------
 * Tracks travel advances issued to employees, along with whether
 * they have been cleared/retired.
 */
@Entity({ name: 'expense_advances' })
export class AdvanceRecord extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_adv_tenant_id')
  tenantId!: string;

  @Column({ name: 'employee_id', type: 'varchar', length: 100 })
  employeeId!: string;

  @Column({ name: 'amount', type: 'numeric', precision: 18, scale: 2 })
  amount!: string;

  @Column({ name: 'currency', type: 'varchar', length: 10 })
  currency!: string;

  @Column({ name: 'issue_date', type: 'date' })
  issueDate!: Date;

  @Column({ name: 'is_cleared', type: 'boolean', default: false })
  isCleared!: boolean;
}
