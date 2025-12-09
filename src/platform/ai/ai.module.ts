import { Module } from '@nestjs/common';
import { AiService } from './ai.service';

/**
 * AiModule
 * --------
 * Platform-level module that will act as a client to the Python-based
 * AI Engine service.
 *
 * For now, AiService only returns stubbed results. Later, it will call
 * the external FastAPI service via HTTP, passing tenant and document
 * context for OCR, classification, and duplicate detection.
 */
@Module({
  providers: [AiService],
  exports: [AiService]
})
export class AiModule {}
