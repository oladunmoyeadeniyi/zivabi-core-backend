import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseRequest } from './expense-request.entity';
import { ExpenseLine } from './expense-line.entity';
import { ExpenseReceiptLink } from './expense-receipt-link.entity';
import { AdvanceRecord } from './advance-record.entity';
import { InvoiceRegistry } from './invoice-registry.entity';
import { FinanceReviewRecord } from './finance-review-record.entity';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { WorkflowModule } from '../../platform/workflow/workflow.module';
import { DocumentsModule } from '../../platform/documents/documents.module';
import { DimensionsModule } from '../../platform/dimensions/dimensions.module';
import { AuditModule } from '../../platform/audit/audit.module';
import { AiModule } from '../../platform/ai/ai.module';

/**
 * ExpenseModule
 * -------------
 * First business domain module implemented for Ziva BI.
 *
 * Responsible for:
 * - Managing expense requests and lines.
 * - Linking receipts (documents) to lines.
 * - Starting workflows for approvals.
 * - Capturing Finance corrections and audit trails.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseRequest,
      ExpenseLine,
      ExpenseReceiptLink,
      AdvanceRecord,
      InvoiceRegistry,
      FinanceReviewRecord
    ]),
    WorkflowModule,
    DocumentsModule,
    DimensionsModule,
    AuditModule,
    AiModule
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService]
})
export class ExpenseModule {}
