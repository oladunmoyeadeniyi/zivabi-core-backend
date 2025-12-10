import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum ExpenseRequestType {
  REIMBURSEMENT = 'REIMBURSEMENT',
  ADVANCE_RETIREMENT = 'ADVANCE_RETIREMENT'
}

/**
 * CreateExpenseRequestDto
 * -----------------------
 * Data needed to create a new draft expense request.
 */
export class CreateExpenseRequestDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsEnum(ExpenseRequestType)
  requestType!: ExpenseRequestType;

  @IsString()
  @IsNotEmpty()
  currency!: string;
}

/**
 * CreateExpenseLineDto
 * --------------------
 * Data needed to add a line to an existing expense request.
 */
export class CreateExpenseLineDto {
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  glCode?: string;

  @IsOptional()
  @IsString()
  plGroup?: string;

  @IsOptional()
  @IsString()
  plLine?: string;
}

/**
 * SubmitExpenseRequestDto
 * -----------------------
 * Placeholder DTO for future submission behaviour; allows optional
 * metadata like comments.
 */
export class SubmitExpenseRequestDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * FinanceReviewUpdateDto
 * ----------------------
 * Very small DTO for Finance to adjust a single field on a line.
 *
 * For now we support a generic "field" + "newValue" pair so that
 * we can evolve the exact list of editable fields over time while
 * keeping the API stable.
 */
export class FinanceReviewUpdateDto {
  @IsString()
  @IsNotEmpty()
  field!: string; // e.g. 'glCode', 'plGroup', 'plLine', 'description'

  @IsString()
  @IsNotEmpty()
  newValue!: string;

  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * ApproveExpenseRequestDto
 * ------------------------
 * Data for approving an expense request.
 */
export class ApproveExpenseRequestDto {
  @IsOptional()
  @IsString()
  comment?: string;
}

/**
 * RejectExpenseRequestDto
 * -----------------------
 * Data for rejecting an expense request.
 */
export class RejectExpenseRequestDto {
  @IsString()
  @IsNotEmpty()
  reason!: string;
}
