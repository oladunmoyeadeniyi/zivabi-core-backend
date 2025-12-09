import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './document.entity';
import { DocumentsService } from './documents.service';

/**
 * DocumentsModule
 * ---------------
 * Platform-level module responsible for all file/document metadata handling.
 *
 * Higher-level modules (Expense, AP, Audit, Vendor Portal, etc.) will use
 * this module to:
 * - Save file metadata when uploads are processed.
 * - Look up documents attached to a given business entity.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  providers: [DocumentsService],
  exports: [DocumentsService]
})
export class DocumentsModule {}
