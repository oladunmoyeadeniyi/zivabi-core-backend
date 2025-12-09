import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GlAccount } from './gl-account.entity';
import { GlDimensionRule } from './gl-dimension-rule.entity';

/**
 * DimensionsService
 * -----------------
 * Provides helper methods to:
 * - Look up GL accounts.
 * - Determine which dimensions are required/optional for a GL.
 * - Validate that a given GL + dimension set is structurally valid.
 */
@Injectable()
export class DimensionsService {
  constructor(
    @InjectRepository(GlAccount)
    private readonly glRepo: Repository<GlAccount>,
    @InjectRepository(GlDimensionRule)
    private readonly ruleRepo: Repository<GlDimensionRule>
  ) {}

  /**
   * getRulesForGl
   * -------------
   * Loads the dimension rule for a given tenant + GL code, if any.
   */
  async getRulesForGl(tenantId: string, glCode: string): Promise<GlDimensionRule | null> {
    return this.ruleRepo.findOne({ where: { tenantId, glCode } });
  }

  /**
   * validateGlDimensions
   * --------------------
   * Very simple structural validation: checks that all required dimensions
   * are present in the provided set. Does NOT verify that each dimension
   * value exists yet; that will be added later.
   */
  async validateGlDimensions(params: {
    tenantId: string;
    glCode: string;
    dimensionKeysPresent: string[];
  }): Promise<{ ok: boolean; missingRequired: string[] }> {
    const rule = await this.getRulesForGl(params.tenantId, params.glCode);
    if (!rule || !rule.requiredDimensionKeys || rule.requiredDimensionKeys.length === 0) {
      return { ok: true, missingRequired: [] };
    }

    const presentSet = new Set(params.dimensionKeysPresent);
    const missing = rule.requiredDimensionKeys.filter((key) => !presentSet.has(key));

    return {
      ok: missing.length === 0,
      missingRequired: missing
    };
  }
}
