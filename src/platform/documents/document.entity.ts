import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

/**
 * Document
 * --------
 * Represents a file stored in an external object storage system (e.g., S3).
 *
 * We keep the binary content outside the database and only store metadata here:
 * - tenantId: which tenant owns this document.
 * - ownerType/ownerId: which business entity this document is attached to
 *   (ExpenseLine, ApInvoice, Vendor, AuditSample, etc.).
 * - fileName, mimeType, size: basic file properties.
 * - storageKey: the exact key/path used in the storage bucket.
 * - sha256 / perceptualHash: used for duplicate detection and fraud checks.
 */
@Entity({ name: 'documents' })
export class Document extends BaseEntity {
  @Column({ name: 'tenant_id', type: 'uuid' })
  @Index('idx_document_tenant_id')
  tenantId!: string;

  /**
   * ownerType / ownerId
   * -------------------
   * Together, these fields indicate what this document is attached to.
   * Example: ownerType = 'expense_line', ownerId = '...uuid...'
   */
  @Column({ name: 'owner_type', type: 'varchar', length: 100 })
  @Index('idx_document_owner')
  ownerType!: string;

  @Column({ name: 'owner_id', type: 'uuid' })
  ownerId!: string;

  /**
   * fileName
   * --------
   * Original file name supplied by the client (for user display only).
   */
  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName!: string;

  /**
   * mimeType
   * --------
   * MIME type such as 'application/pdf', 'image/jpeg', etc.
   */
  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType!: string;

  /**
   * sizeBytes
   * ---------
   * Size of the file in bytes.
   */
  @Column({ name: 'size_bytes', type: 'bigint' })
  sizeBytes!: string;

  /**
   * storageKey
   * ----------
   * The full key/path used in the object storage bucket.
   * Example: 'tenant-123/expense/2025/03/receipt_abc.pdf'
   */
  @Column({ name: 'storage_key', type: 'varchar', length: 512 })
  @Index('idx_document_storage_key', { unique: true })
  storageKey!: string;

  /**
   * sha256
   * ------
   * Cryptographic hash used to detect exact duplicates.
   */
  @Column({ name: 'sha256', type: 'char', length: 64 })
  @Index('idx_document_sha256')
  sha256!: string;

  /**
   * perceptualHash
   * --------------
   * Hash for detecting visually similar images (e.g., tampered receipts).
   * Optional because not all file types support it.
   */
  @Column({ name: 'perceptual_hash', type: 'varchar', length: 128, nullable: true })
  perceptualHash: string | null = null;
}
