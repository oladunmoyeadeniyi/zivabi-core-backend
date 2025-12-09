import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApService } from './ap.service';
import { CreateApInvoiceDto, CreateApInvoiceLineDto } from './ap.dto';
import { JwtAuthGuard } from '../../platform/auth/jwt-auth.guard';
import { Permissions } from '../../platform/rbac/permissions.decorator';
import { CurrentUser, CurrentUserPayload } from '../../platform/auth/current-user.decorator';

@Controller('ap')
export class ApController {
  constructor(private readonly apService: ApService) {}

  @UseGuards(JwtAuthGuard)
  @Permissions('ap.invoice.view')
  @Post('invoices/list')
  async listInvoices(@CurrentUser() user: CurrentUserPayload | undefined) {
    if (!user) throw new Error('User context missing');
    return this.apService.listInvoices(user.tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('ap.invoice.view')
  @Post('invoices/:invoiceId')
  async getInvoice(
    @Param('invoiceId') invoiceId: string,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) throw new Error('User context missing');
    return this.apService.getInvoiceWithLines(user.tenantId, invoiceId);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('ap.invoice.submit')
  @Post('invoices')
  async createInvoice(
    @Body() body: CreateApInvoiceDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) throw new Error('User context missing');
    return this.apService.createDraft(user.tenantId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('ap.invoice.submit')
  @Post('invoices/:invoiceId/lines')
  async addLine(
    @Param('invoiceId') invoiceId: string,
    @Body() body: CreateApInvoiceLineDto,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) throw new Error('User context missing');
    return this.apService.addLine(user.tenantId, invoiceId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Permissions('ap.invoice.submit')
  @Post('invoices/:invoiceId/submit')
  async submit(
    @Param('invoiceId') invoiceId: string,
    @CurrentUser() user: CurrentUserPayload | undefined
  ) {
    if (!user) throw new Error('User context missing');
    return this.apService.submit(user.tenantId, invoiceId);
  }
}
