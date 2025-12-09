import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';

/**
 * DocumentsService
 * ----------------
 * Provides helper methods to create and query Document records.
 *
 * NOTE: This service does NOT handle the actual binary upload/download of
 * files to object storage. That responsibility will belong to a separate
 * storage adapter layer (e.g., S3 client) that this service will call.
 */
@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly docRepo: Repository<Document>
  ) {}

  /**
   * saveMetadata
   * ------------
   * Creates and saves a new Document record with the given metadata.
   */
  async saveMetadata(partial: Partial<Document>): Promise<Document> {
    const doc = this.docRepo.create(partial);
    return this.docRepo.save(doc);
  }

  /**
   * findByOwner
   * -----------
   * Returns all documents attached to a specific ownerType + ownerId.
   */
  async findByOwner(ownerType: string, ownerId: string): Promise<Document[]> {
    return this.docRepo.find({ where: { ownerType, ownerId } });
  }
}
