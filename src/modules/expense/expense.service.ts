import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { ExpenseRequest } from './expense-request.entity';
import { ExpenseLine } from './expense-line.entity';
import { ExpenseReceiptLink } from './expense-receipt-link.entity';
import { FinanceReviewRecord } from './finance-review-record.entity';
import { CreateExpenseRequestDto, CreateExpenseLineDto, ExpenseRequestType, FinanceReviewUpdateDto } from './expense.dto';
import { WorkflowService } from '../../platform/workflow/workflow.service';
import { AuditService } from '../../platform/audit/audit.service';
import { DocumentsService } from '../../platform/documents/documents.service';
import { AiService } from '../../platform/ai/ai.service';

/**
 * ExpenseService
 * --------------
 * Contains the core business logic for the Expense module.
 *
 * For this initial version we support:
 * - Creating a draft expense request.
 * - Adding lines to a request.
 * - Submitting a request (starting a workflow instance stub).
 */
@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseRequest)
    private readonly reqRepo: Repository<ExpenseRequest>,
    @InjectRepository(ExpenseLine)
    private readonly lineRepo: Repository<ExpenseLine>,
    @InjectRepository(ExpenseReceiptLink)
    private readonly receiptLinkRepo: Repository<ExpenseReceiptLink>,
    @InjectRepository(FinanceReviewRecord)
    private readonly finReviewRepo: Repository<FinanceReviewRecord>,
    private readonly workflowService: WorkflowService,
    private readonly auditService: AuditService,
    private readonly documentsService: DocumentsService,
    private readonly aiService: AiService
  ) {}

  /**
   * listRequests
   * ------------
   * Returns all expense requests for a given tenant.
   *
   * Later we will add filtering (by employee, status, date range, etc.).
   */
  async listRequests(tenantId: string): Promise<ExpenseRequest[]> {
    return this.reqRepo.find({ where: { tenantId }, order: { createdAt: 'DESC' } });
  }

  /**
   * getRequestWithLines
   * --------------------
   * Loads a single request together with its lines.
   *
   * NOTE: For now, this method returns a simple composite object; later we may
   * introduce dedicated view models or use TypeORM relations.
   */
  async getRequestWithLines(tenantId: string, requestId: string): Promise<{ request: ExpenseRequest; lines: ExpenseLine[] }> {
    const request = await this.reqRepo.findOne({ where: { id: requestId, tenantId } });
    if (!request) {
      throw new NotFoundException('Expense request not found');
    }
    const lines = await this.lineRepo.find({ where: { requestId, tenantId }, order: { lineNumber: 'ASC' } });
    return { request, lines };
  }

  /**
   * createDraft
   * -----------
   * Creates a new draft ExpenseRequest for the given tenant/employee.
   */
  async createDraft(tenantId: string, dto: CreateExpenseRequestDto): Promise<ExpenseRequest> {
    const request = this.reqRepo.create({
      tenantId,
      employeeId: dto.employeeId,
      requestType: dto.requestType,
      status: 'DRAFT',
      totalAmount: '0',
      currency: dto.currency
    });
    const saved = await this.reqRepo.save(request);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ExpenseRequest',
      entityId: saved.id,
      action: 'CREATED',
      actorUserId: null,
      afterData: { ...dto, id: saved.id }
    });

    return saved;
  }

  /**
   * addLine
   * -------
   * Adds a new line to an existing expense request.
   */
  async addLine(tenantId: string, requestId: string, dto: CreateExpenseLineDto): Promise<ExpenseLine> {
    const request = await this.reqRepo.findOne({ where: { id: requestId, tenantId } });
    if (!request) {
      throw new NotFoundException('Expense request not found');
    }

    const existingLines = await this.lineRepo.count({ where: { requestId: request.id, tenantId } });
    const lineNumber = existingLines + 1;

    const line = this.lineRepo.create({
      tenantId,
      requestId: request.id,
      lineNumber,
      amount: dto.amount.toString(),
      currency: dto.currency,
      description: dto.description ?? null,
      glCode: dto.glCode ?? null,
      plGroup: dto.plGroup ?? null,
      plLine: dto.plLine ?? null,
      vatAmount: '0',
      ocrConfidence: 0,
      duplicateSuspected: false
    });

    const saved = await this.lineRepo.save(line);

    // Update totalAmount on the request (simple recalculation for now).
    const allLines = await this.lineRepo.find({ where: { requestId: request.id, tenantId } });
    const total = allLines.reduce((sum, l) => sum + parseFloat(l.amount), 0);
    request.totalAmount = total.toFixed(2);
    await this.reqRepo.save(request);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ExpenseLine',
      entityId: saved.id,
      action: 'LINE_ADDED',
      actorUserId: null,
      afterData: { ...dto, id: saved.id, requestId: request.id }
    });

    return saved;
  }

  /**
   * financeAdjustLine
   * ------------------
   * Allows Finance to adjust a single field on a line and records the
   * change in FinanceReviewRecord and the audit log.
   */
  async financeAdjustLine(tenantId: string, lineId: string, dto: FinanceReviewUpdateDto): Promise<ExpenseLine> {
    const line = await this.lineRepo.findOne({ where: { id: lineId, tenantId } });
    if (!line) {
      throw new NotFoundException('Expense line not found');
    }

    // Determine old and new values based on the requested field.
    const field = dto.field as keyof ExpenseLine;
    const oldValue = (line as any)[field];
    (line as any)[field] = dto.newValue;
    const saved = await this.lineRepo.save(line);

    // Record Finance review detail.
    const review = this.finReviewRepo.create({
      tenantId,
      lineId: line.id,
      fieldChanged: dto.field,
      oldValue: oldValue != null ? String(oldValue) : null,
      newValue: dto.newValue,
      financeUserId: null // will later be filled from JWT user id
    });
    await this.finReviewRepo.save(review);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ExpenseLine',
      entityId: line.id,
      action: 'FINANCE_ADJUSTED',
      actorUserId: null,
      beforeData: { [dto.field]: oldValue },
      afterData: { [dto.field]: dto.newValue },
      metadata: dto.comment ? { comment: dto.comment } : null
    });

    return saved;
  }

  /**
   * attachReceiptToLine
   * --------------------
   * Stores metadata for an uploaded receipt in the Document store and
   * links it to the specified ExpenseLine. Also calls the AI stub to
   * obtain an OCR confidence score and duplicate hint.
   */
  async attachReceiptToLine(tenantId: string, lineId: string, file: Express.Multer.File) {
    const line = await this.lineRepo.findOne({ where: { id: lineId, tenantId } });
    if (!line) {
      throw new NotFoundException('Expense line not found');
    }

    // Compute a SHA256 hash for duplicate detection.
    // If Multer is configured with memory storage, file.buffer will contain
    // the raw bytes. If not, we fall back to hashing stable metadata so that
    // this method still works without crashing (we can refine this later
    // when wiring a real storage adapter).
    const bufferToHash = file.buffer ?? Buffer.from(
      `${file.originalname}:${file.size}:${file.mimetype}`,
      'utf8'
    );
    const sha256 = crypto.createHash('sha256').update(bufferToHash).digest('hex');

    // Build a storage key. In a later phase this will correspond to a real
    // object storage location (e.g., S3 bucket path).
    const storageKey = `tenant-${tenantId}/expense/lines/${lineId}/${Date.now()}-${file.originalname}`;

    const document = await this.documentsService.saveMetadata({
      tenantId,
      ownerType: 'ExpenseLine',
      ownerId: line.id,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size.toString(),
      storageKey,
      sha256,
      perceptualHash: null
    });

    // Create the join record linking the line to this document.
    const link = this.receiptLinkRepo.create({
      tenantId,
      lineId: line.id,
      documentId: document.id
    });
    await this.receiptLinkRepo.save(link);

    // Call the AI stub to get basic analysis (will be replaced by real calls).
    const aiResult = await this.aiService.analyzeExpenseReceipt({
      tenantId,
      documentId: document.id
    });

    // Update line with AI hints.
    line.ocrConfidence = aiResult.ocrConfidence;
    if (aiResult.duplicateSuspected) {
      line.duplicateSuspected = true;
    }
    await this.lineRepo.save(line);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ExpenseLine',
      entityId: line.id,
      action: 'RECEIPT_ATTACHED',
      actorUserId: null,
      metadata: {
        documentId: document.id,
        fileName: file.originalname,
        mimeType: file.mimetype,
        size: file.size
      }
    });

    return {
      lineId: line.id,
      documentId: document.id
    };
  }

  /**
   * submit
   * ------
   * Very simple submission behaviour:
   * - Marks the request as SUBMITTED.
   * - Starts a WorkflowInstance placeholder.
   */
  async submit(tenantId: string, requestId: string): Promise<ExpenseRequest> {
    const request = await this.reqRepo.findOne({ where: { id: requestId, tenantId } });
    if (!request) {
      throw new NotFoundException('Expense request not found');
    }

    request.status = 'SUBMITTED';
    const saved = await this.reqRepo.save(request);

    // TODO: use a real workflow definition id. For now we use a placeholder
    // value and rely on future configuration.
    const dummyDefinitionId = '00000000-0000-0000-0000-000000000000';
    const instance = await this.workflowService.startInstance({
      tenantId,
      definitionId: dummyDefinitionId,
      ownerType: 'ExpenseRequest',
      ownerId: saved.id
    });

    saved.workflowInstanceId = instance.id;
    await this.reqRepo.save(saved);

    await this.auditService.logEvent({
      tenantId,
      entityType: 'ExpenseRequest',
      entityId: saved.id,
      action: 'SUBMITTED',
      actorUserId: null,
      afterData: { status: saved.status, workflowInstanceId: saved.workflowInstanceId }
    });

    return saved;
  }
}
