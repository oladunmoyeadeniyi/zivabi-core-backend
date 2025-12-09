import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './tenant.entity';

/**
 * TenantsService
 * --------------
 * This service is responsible for working with tenant data.
 *
 * It now uses a TypeORM Repository<Tenant> to talk to the PostgreSQL database,
 * instead of a temporary in-memory list.
 */
@Injectable()
export class TenantsService {
  constructor(
    /**
     * tenantRepo
     * ----------
     * TypeORM repository that can perform CRUD operations on the tenants table.
     */
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>
  ) {}

  /**
   * Get a tenant by its unique identifier.
   */
  async findById(id: string): Promise<Tenant | null> {
    return this.tenantRepo.findOne({ where: { id } });
  }

  /**
   * List all tenants.
   *
   * Later we will add paging, filtering, and security rules so that
   * only Super Admin and authorized users can see all tenants.
   */
  async listAll(): Promise<Tenant[]> {
    return this.tenantRepo.find();
  }
}
