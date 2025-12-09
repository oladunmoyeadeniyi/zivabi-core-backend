import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum ApInvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED'
}

export class CreateApInvoiceDto {
  @IsString()
  @IsNotEmpty()
  vendorId!: string;

  @IsString()
  @IsNotEmpty()
  invoiceNumber!: string;

  @IsDateString()
  invoiceDate!: string;

  @IsString()
  @IsNotEmpty()
  currency!: string;

  @IsNumber()
  @Min(0.01)
  amountFx!: number;

  @IsNumber()
  @Min(0.000001)
  fxRate!: number;
}

export class CreateApInvoiceLineDto {
  @IsNumber()
  @Min(0.01)
  amountFx!: number;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  glCode?: string;
}
