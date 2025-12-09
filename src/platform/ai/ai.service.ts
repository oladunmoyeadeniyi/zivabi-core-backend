import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

/**
 * AiService
 * ---------
 * This service calls the external Python AI Engine over HTTP.
 *
 * Responsibilities (current + future):
 * - Submit documents for OCR.
 * - Request GL and dimension predictions.
 * - Request duplicate detection and fraud scores.
 * - Provide typed results back to business modules.
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  /**
   * Returns the base URL of the AI Engine service.
   * Default: http://localhost:8000
   */
  private getAiBaseUrl(): string {
    return process.env.AI_BASE_URL || 'http://localhost:8000';
  }

  /**
   * analyzeExpenseReceipt
   * ----------------------
   * Calls the Python AI service to analyze an expense receipt by reference.
   *
   * If the AI service is unreachable or errors, we log the error and fall
   * back to a safe default so the rest of the system continues to work.
   */
  async analyzeExpenseReceipt(params: {
    tenantId: string;
    documentId: string;
  }): Promise<{ ocrConfidence: number; duplicateSuspected: boolean }> {
    const baseUrl = this.getAiBaseUrl();
    const url = `${baseUrl}/ai/expense/receipt/analyze`;

    try {
      const res = await axios.post(url, {
        tenant_id: params.tenantId,
        document_id: params.documentId
      }, {
        timeout: 10000
      });

      const data = res.data as { ocr_confidence: number; duplicate_suspected: boolean };

      return {
        ocrConfidence: data.ocr_confidence,
        duplicateSuspected: data.duplicate_suspected
      };
    } catch (error: any) {
      this.logger.error(
        `AI Engine call failed for tenant=${params.tenantId}, document=${params.documentId}: ${error?.message}`
      );

      // Fallback behaviour: same as the previous stub so nothing breaks.
      return {
        ocrConfidence: 75,
        duplicateSuspected: false
      };
    }
  }
}
