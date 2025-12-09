import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';

/**
 * RbacService
 * -----------
 * Provides methods to:
 * - Create/find roles and permissions.
 * - Assign roles to users.
 * - Check whether a user has certain permissions.
 *
 * NOTE: For now, the methods are intentionally simple and will be evolved
 * step-by-step as we flesh out authentication and module access rules.
 */
@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermRepo: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>
  ) {}

  /**
   * Ensure a role with the given key exists for a tenant, creating it if needed.
   */
  async ensureRole(tenantId: string, key: string, displayName: string): Promise<Role> {
    let role = await this.roleRepo.findOne({ where: { tenantId, key } });
    if (!role) {
      role = this.roleRepo.create({ tenantId, key, displayName });
      role = await this.roleRepo.save(role);
    }
    return role;
  }

  /**
   * Ensure a permission with the given key exists globally.
   */
  async ensurePermission(key: string, description?: string): Promise<Permission> {
    let perm = await this.permRepo.findOne({ where: { key } });
    if (!perm) {
      perm = this.permRepo.create({ key, description: description ?? null });
      perm = await this.permRepo.save(perm);
    }
    return perm;
  }

  /**
   * Grant a permission to a role (idempotent: calling twice has no extra effect).
   */
  async grantPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const existing = await this.rolePermRepo.findOne({ where: { roleId, permissionId } });
    if (!existing) {
      const rp = this.rolePermRepo.create({ roleId, permissionId });
      await this.rolePermRepo.save(rp);
    }
  }

  /**
   * Assign a role to a user (idempotent).
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const existing = await this.userRoleRepo.findOne({ where: { userId, roleId } });
    if (!existing) {
      const ur = this.userRoleRepo.create({ userId, roleId });
      await this.userRoleRepo.save(ur);
    }
  }

  /**
   * Check if a user has at least one of the given permission keys.
   *
   * This method will be used by guards to protect endpoints.
   */
  async userHasAnyPermission(userId: string, permissionKeys: string[]): Promise<boolean> {
    if (permissionKeys.length === 0) return true;

    // Step 1: Find all roles for the user.
    const userRoles = await this.userRoleRepo.find({ where: { userId } });
    if (userRoles.length === 0) return false;
    const roleIds = userRoles.map((ur) => ur.roleId);

    // Step 2: Find all permissions attached to those roles.
    const rolePerms = await this.rolePermRepo.find({ where: { roleId: roleIds as any } });
    if (rolePerms.length === 0) return false;
    const permissionIds = rolePerms.map((rp) => rp.permissionId);

    // Step 3: Check if any of the permissions has a key in permissionKeys.
    const perms = await this.permRepo.findByIds(permissionIds);
    const keysSet = new Set(permissionKeys);
    return perms.some((p) => keysSet.has(p.key));
  }
}
