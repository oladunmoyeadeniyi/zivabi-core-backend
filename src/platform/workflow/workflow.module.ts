import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowInstance } from './workflow-instance.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WorkflowService } from './workflow.service';

/**
 * WorkflowModule
 * --------------
 * Platform-level module providing a generic workflow engine used by
 * Expense, AP, AR, Audit, and other modules that require approvals.
 */
@Module({
  imports: [TypeOrmModule.forFeature([WorkflowDefinition, WorkflowInstance, WorkflowStep])],
  providers: [WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
