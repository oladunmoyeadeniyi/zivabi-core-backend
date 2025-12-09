import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlAccount } from './gl-account.entity';
import { DimensionType } from './dimension-type.entity';
import { DimensionValue } from './dimension-value.entity';
import { GlDimensionRule } from './gl-dimension-rule.entity';
import { DimensionsService } from './dimensions.service';

/**
 * DimensionsModule
 * ----------------
 * Platform engine that understands GL accounts and their required dimensions.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([GlAccount, DimensionType, DimensionValue, GlDimensionRule])
  ],
  providers: [DimensionsService],
  exports: [DimensionsService]
})
export class DimensionsModule {}
