import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpenseService } from './expense.service';
import {
  CreateExpenseRequestDto,
  CreateExpenseLineDto,
  SubmitExpenseRequestDto,
  FinanceReviewUpdateDto,
  ApproveExpenseRequestDto,
  RejectExpenseRequestDto
} from './expense.dto';
import { JwtAuthGuard } from '../../platform/auth/jwt-auth.guard';
import { Permissions } from '../../platform/rbac/permissions.decorator';
import { CurrentUser, CurrentUserPayload } from '../../platform/auth/current-user.decorator';
import { Express } from 'express';

/**
 * ExpenseController
 * -----------------
 * HTTP layer for the Expense module.
 *
 * NOTE:
 * - We already hook in JwtAuthGuard and Permissions decorator so
 *   the endpoints are aligned with the security model.
 * - For now, we keep endpoints minimal and will extend them alongside
 *   the UI and PRD requirements.
 *
 * Production-ready endpoints include:
 * - GET /expense/requests - list requests with optional filters
 * - GET /expense/requests/:requestId - get single request with lines
 * - POST /expense/requests - create new draft request
 * - POST /expense/requests/:requestId/lines - add line to request
 * - POST /expense/requests/:requestId/submit - submit for approval
 * - POST /expense/requests/:requestId/approve - approve request
 * - POST /expense/requests/:requestId/reject - reject request
 * - POST /expense/requests/:requestId/cancel - cancel request
 * - POST /expense/lines/:lineId/receipts - upload receipt
 * - POST /expense/lines/:lineId/finance-review - finance adjustment
 */
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  /**
   * GET /expense/requests
   * ---------------------
   * Lists expense requests for the current tenant.
   * Optional query filters: status, employeeId.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.view')
  @Get('requests')
  async listRequests(
    @CurrentUser() user: CurrentUserPayload | undefined,
    @Query('status') status?: string,
    @Query('employeeId') employeeId?: string
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.listRequests(user.tenantId, { status, employeeId });
  }

  /**
   * POST /expense/requests/list (legacy endpoint, kept for compatibility)
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.view')
  @Post('requests/list')
  async listRequestsPost(@CurrentUser() user: CurrentUserPayload | undefined) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.listRequests(user.tenantId);
  }

  /**
   * GET /expense/requests/:requestId
   * ---------------------------------
   * Returns a single request with its lines.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.view')
  @Get('requests/:requestId')
  async getRequestById(
    @Param('requestId') requestId: string,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.getRequestWithLines(user.tenantId, requestId);
  }

  /**
   * POST /expense/requests
   * ----------------------
   * Creates a new draft expense request for the current tenant/employee.
   *
   * In a later phase, we will infer tenantId and employeeId from
   * request.user; for now we accept tenantId as a temporary body field
   * for easier bootstrapping.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.submit')
  @Post('requests')
  async createRequest(@Body() body: any, @CurrentUser() user: CurrentUserPayload | undefined) {
    if (!user) {
      throw new Error('User context missing');
    }
    const dto: CreateExpenseRequestDto = {
      employeeId: body.employeeId ?? user.id,
      requestType: body.requestType,
      currency: body.currency
    };
    return this.expenseService.createDraft(user.tenantId, dto);
  }

  /**
   * POST /expense/requests/:requestId
   * ---------------------------------
   * Returns a single request with its lines.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.view')
  @Post('requests/:requestId')
  async getRequest(
    @Param('requestId') requestId: string,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new Error('User context missing');
    }
    return this.expenseService.getRequestWithLines(user.tenantId, requestId);
  }

  /**
   * POST /expense/requests/:requestId/lines
   * ---------------------------------------
   * Adds a line to an existing expense request.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.submit')
  @Post('requests/:requestId/lines')
  async addLine(
    @Param('requestId') requestId: string,
    @Body() body: any,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new Error('User context missing');
    }
    const dto: CreateExpenseLineDto = {
      amount: body.amount,
      currency: body.currency,
      description: body.description,
      glCode: body.glCode,
      plGroup: body.plGroup,
      plLine: body.plLine
    };
    return this.expenseService.addLine(user.tenantId, requestId, dto);
  }

  /**
   * POST /expense/requests/:requestId/submit
   * ----------------------------------------
   * Submits an expense request for approval.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.submit')
  @Post('requests/:requestId/submit')
  async submit(
    @Param('requestId') requestId: string,
    @Body() _body: SubmitExpenseRequestDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new Error('User context missing');
    }
    return this.expenseService.submit(user.tenantId, requestId);
  }

  /**
   * POST /expense/lines/:lineId/finance-review
   * ------------------------------------------
   * Allows Finance to adjust a single field on a line.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.finance.review')
  @Post('lines/:lineId/finance-review')
  async financeReview(
    @Param('lineId') lineId: string,
    @Body() body: FinanceReviewUpdateDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new Error('User context missing');
    }
    return this.expenseService.financeAdjustLine(user.tenantId, lineId, body);
  }

  /**
   * POST /expense/requests/:requestId/approve
   * -----------------------------------------
   * Approves an expense request (manager action).
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.approve')
  @Post('requests/:requestId/approve')
  async approve(
    @Param('requestId') requestId: string,
    @Body() body: ApproveExpenseRequestDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.approve(user.tenantId, requestId, user.id, body.comment);
  }

  /**
   * POST /expense/requests/:requestId/reject
   * ----------------------------------------
   * Rejects an expense request (manager action).
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.approve')
  @Post('requests/:requestId/reject')
  async reject(
    @Param('requestId') requestId: string,
    @Body() body: RejectExpenseRequestDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.reject(user.tenantId, requestId, user.id, body.reason);
  }

  /**
   * POST /expense/requests/:requestId/cancel
   * ----------------------------------------
   * Cancels an expense request (employee action, only if still in DRAFT/SUBMITTED).
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.submit')
  @Post('requests/:requestId/cancel')
  async cancel(
    @Param('requestId') requestId: string,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.cancel(user.tenantId, requestId, user.id);
  }

  /**
   * POST /expense/lines/:lineId/receipts
   * ------------------------------------
   * Uploads a receipt file and links it to a specific expense line.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.submit')
  @Post('lines/:lineId/receipts')
  @UseInterceptors(FileInterceptor('file'))
  async uploadReceipt(
    @Param('lineId') lineId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() _body: any,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) {
      throw new BadRequestException('User context missing');
    }
    return this.expenseService.attachReceiptToLine(user.tenantId, lineId, file);
  }
}
