import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApInvoiceHeader } from './ap-invoice-header.entity';
import { ApInvoiceLine } from './ap-invoice-line.entity';
import { CreateApInvoiceDto, CreateApInvoiceLineDto, ApInvoiceStatus } from './ap.dto';
import { WorkflowService } from '../../platform/workflow/workflow.service';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class ApService {
  constructor(
    @InjectRepository(ApInvoiceHeader)
    private readonly headerRepo: Repository<ApInvoiceHeader>,
    @InjectRepository(ApInvoiceLine)
    private readonly lineRepo: Repository<ApInvoiceLine>,
    private readonly workflowService: WorkflowService,
    private readonly auditService: AuditService
  ) {}

  async listInvoices(tenantId: string): Promise<ApInvoiceHeader[]> {
    return this.headerRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  async getInvoiceWithLines(
    tenantId: string,
    invoiceId: string
  ): Promise<{ header: ApInvoiceHeader; lines: ApInvoiceLine[] }> {
    const header = await this.headerRepo.findOne({ where: { id: invoiceId, tenantId } });
    if (!header) {
      throw new NotFoundException('Invoice not found');
    }
    const lines = await this.lineRepo.find({ where: { invoiceId, tenantId }, order: { lineNumber: 'ASC' } });
    return { header, lines };
  }

  async createDraft(tenantId: string, dto: CreateApInvoiceDto): Promise<ApInvoiceHeader> {
    const amountLocal = dto.amountFx * dto.fxRate;
    const header = this.headerRepo.create({
      tenantId,
      vendorId: dto.vendorId,
      invoiceNumber: dto.invoiceNumber,
      invoiceDate: new Date(dto.invoiceDate),
      currency: dto.currency,
      amountFx: dto.amountFx.toFixed(2),
      amountLocal: amountLocal.toFixed(2),
      fxRateUsed: dto.fxRate.toFixed(6),
      status: ApInvoiceStatus.DRAFT
    });
    const saved = await this.headerRepo.save(header);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ApInvoiceHeader',
      entityId: saved.id,
      action: 'CREATED',
      actorUserId: null,
      afterData: { ...dto, id: saved.id }
    });

    return saved;
  }

  async addLine(tenantId: string, invoiceId: string, dto: CreateApInvoiceLineDto): Promise<ApInvoiceLine> {
    const header = await this.headerRepo.findOne({ where: { id: invoiceId, tenantId } });
    if (!header) {
      throw new NotFoundException('Invoice not found');
    }

    const existingCount = await this.lineRepo.count({ where: { invoiceId: header.id, tenantId } });
    const lineNumber = existingCount + 1;

    const amountLocal = dto.amountFx * parseFloat(header.fxRateUsed);

    const line = this.lineRepo.create({
      tenantId,
      invoiceId: header.id,
      lineNumber,
      description: dto.description,
      amountFx: dto.amountFx.toFixed(2),
      amountLocal: amountLocal.toFixed(2),
      glCode: dto.glCode ?? null,
      plGroup: null,
      plLine: null
    });

    const saved = await this.lineRepo.save(line);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ApInvoiceLine',
      entityId: saved.id,
      action: 'LINE_ADDED',
      actorUserId: null,
      afterData: { ...dto, id: saved.id, invoiceId: header.id }
    });

    return saved;
  }

  async submit(tenantId: string, invoiceId: string): Promise<ApInvoiceHeader> {
    const header = await this.headerRepo.findOne({ where: { id: invoiceId, tenantId } });
    if (!header) {
      throw new NotFoundException('Invoice not found');
    }

    header.status = ApInvoiceStatus.SUBMITTED;
    const saved = await this.headerRepo.save(header);

    const dummyDefinitionId = '00000000-0000-0000-0000-000000000000';
    const instance = await this.workflowService.startInstance({
      tenantId,
      definitionId: dummyDefinitionId,
      ownerType: 'ApInvoiceHeader',
      ownerId: saved.id
    });

    saved.workflowInstanceId = instance.id;
    await this.headerRepo.save(saved);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ApInvoiceHeader',
      entityId: saved.id,
      action: 'SUBMITTED',
      actorUserId: null,
      afterData: { status: saved.status, workflowInstanceId: saved.workflowInstanceId }
    });

    return saved;
  }
}
