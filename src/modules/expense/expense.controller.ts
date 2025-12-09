import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExpenseService } from './expense.service';
import { CreateExpenseRequestDto, CreateExpenseLineDto, SubmitExpenseRequestDto, FinanceReviewUpdateDto } from './expense.dto';
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
 */
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  /**
   * GET /expense/requests
   * ---------------------
   * Lists all expense requests for a tenant.
   *
   * TEMP: tenantId is supplied via query/body until we wire JWT tenant context.
   */
  @UseGuards(JwtAuthGuard)
  @Permissions('expense.view')
  @Post('requests/list')
  async listRequests(@CurrentUser() user: CurrentUserPayload | undefined) {
    if (!user) {
      // JwtAuthGuard should normally ensure user is defined.
      throw new Error('User context missing');
    }
    return this.expenseService.listRequests(user.tenantId);
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
      throw new Error('User context missing');
    }
    return this.expenseService.attachReceiptToLine(user.tenantId, lineId, file);
  }
}
