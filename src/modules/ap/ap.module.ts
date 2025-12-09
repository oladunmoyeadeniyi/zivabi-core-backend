import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApInvoiceHeader } from './ap-invoice-header.entity';
import { ApInvoiceLine } from './ap-invoice-line.entity';
import { ApLineSplitHistory } from './ap-line-split-history.entity';
import { ApBeneficiary } from './ap-beneficiary.entity';
import { ApService } from './ap.service';
import { ApController } from './ap.controller';
import { WorkflowModule } from '../../platform/workflow/workflow.module';
import { DocumentsModule } from '../../platform/documents/documents.module';
import { DimensionsModule } from '../../platform/dimensions/dimensions.module';
import { AuditModule } from '../../platform/audit/audit.module';
import { AiModule } from '../../platform/ai/ai.module';

/**
 * ApModule
 * --------
 * Initial implementation of the Accounts Payable (AP) module.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApInvoiceHeader,
      ApInvoiceLine,
      ApLineSplitHistory,
      ApBeneficiary
    ]),
    WorkflowModule,
    DocumentsModule,
    DimensionsModule,
    AuditModule,
    AiModule
  ],
  controllers: [ApController],
  providers: [ApService]
})
export class ApModule {}
