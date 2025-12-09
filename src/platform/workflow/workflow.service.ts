import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkflowDefinition } from './workflow-definition.entity';
import { WorkflowInstance } from './workflow-instance.entity';
import { WorkflowStep } from './workflow-step.entity';

/**
 * WorkflowService
 * ---------------
 * Provides basic primitives for starting and advancing workflows.
 *
 * This is intentionally minimal at this stage; later we will expand it
 * to fully support the rich workflow behaviour described in the PRDs
 * (multi-level approvals, SLAs, escalations, partial rejections, etc.).
 */
@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(WorkflowDefinition)
    private readonly defRepo: Repository<WorkflowDefinition>,
    @InjectRepository(WorkflowInstance)
    private readonly instRepo: Repository<WorkflowInstance>,
    @InjectRepository(WorkflowStep)
    private readonly stepRepo: Repository<WorkflowStep>
  ) {}

  /**
   * startInstance
   * -------------
   * Creates a new WorkflowInstance for a given tenant + definition + owner.
   *
   * For now, it only creates a single PENDING step with order = 0.
   */
  async startInstance(params: {
    tenantId: string;
    definitionId: string;
    ownerType: string;
    ownerId: string;
  }): Promise<WorkflowInstance> {
    const instance = await this.instRepo.save(
      this.instRepo.create({
        tenantId: params.tenantId,
        definitionId: params.definitionId,
        ownerType: params.ownerType,
        ownerId: params.ownerId,
        status: 'IN_PROGRESS'
      })
    );

    const step = this.stepRepo.create({
      instanceId: instance.id,
      stepOrder: 0,
      roleKey: 'PENDING_CONFIG',
      status: 'PENDING'
    });
    await this.stepRepo.save(step);

    return instance;
  }

  /**
   * markStepCompleted
   * ------------------
   * Very simple helper to mark a step as APPROVED or REJECTED.
   * Later, this will also update the instance status and spawn
   * the next step based on the workflow definition.
   */
  async markStepCompleted(stepId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    await this.stepRepo.update(stepId, {
      status,
      actedAt: new Date()
    });
  }
}
