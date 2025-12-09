import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
import { RbacService } from './rbac.service';

/**
 * RbacModule
 * ----------
 * Central module for Role-Based Access Control in Ziva BI.
 *
 * Responsibilities (now and in future):
 * - Manage roles and permissions per tenant.
 * - Assign roles to users.
 * - Check whether a user has a specific permission.
 * - Provide helpers/guards for protecting API endpoints.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission, RolePermission, UserRole])
  ],
  providers: [RbacService],
  exports: [RbacService]
})
export class RbacModule {}
