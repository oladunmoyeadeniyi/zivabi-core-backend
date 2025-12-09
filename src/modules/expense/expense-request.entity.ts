import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * ExpenseRequest
 * --------------
 * Represents a single expense reimbursement or travel advance retirement
 * submission made by an employee.
 */
@Entity({ name: 'expense_requests' })
export class ExpenseRequest extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_exp_req_tenant_id')
  tenantId!: string;

  /**
   * employeeId
   * ----------
   * Identifier of the employee submitting the request.
   * In a later phase this will link to an EmployeeProfile table or HRIS.
   */
  @Column({ name: 'employee_id', type: 'varchar', length: 100 })
  employeeId!: string;

  /**
   * requestType
   * -----------
   * Either 'REIMBURSEMENT' or 'ADVANCE_RETIREMENT'.
   */
  @Column({ name: 'request_type', type: 'varchar', length: 50 })
  requestType!: 'REIMBURSEMENT' | 'ADVANCE_RETIREMENT';

  /**
   * status
   * ------
   * High-level lifecycle state of the request.
   * Example values: DRAFT, SUBMITTED, IN_APPROVAL, FINANCE_REVIEW,
   * APPROVED, REJECTED, PAID, ARCHIVED.
   */
  @Column({ name: 'status', type: 'varchar', length: 50 })
  status!: string;

  /**
   * totalAmount
   * -----------
   * Total monetary amount of all lines, in the request currency.
   */
  @Column({ name: 'total_amount', type: 'numeric', precision: 18, scale: 2, default: 0 })
  totalAmount!: string;

  /**
   * currency
   * --------
   * ISO currency code of the request (e.g., 'NGN', 'USD').
   */
  @Column({ name: 'currency', type: 'varchar', length: 10 })
  currency!: string;

  /**
   * workflowInstanceId
   * -------------------
   * Optional link to the WorkflowInstance controlling approvals for this
   * request. We store just the UUID here to avoid tight coupling.
   */
  @Column({ name: 'workflow_instance_id', type: 'uuid', nullable: true })
  workflowInstanceId: string | null = null;
}
