import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Tenant } from '../platform/tenants/tenant.entity';
import { User } from '../platform/users/user.entity';
import { RbacService } from '../platform/rbac/rbac.service';

/**
 * DevSeedController
 * ------------------
 * Provides a development-only endpoint to seed the database with:
 * - One demo tenant.
 * - One demo admin user.
 * - One admin role + permission assigned to that user.
 *
 * SAFETY:
 * - This endpoint is ONLY active when ALLOW_DEV_SEED === 'true'.
 * - In any real production environment, ALLOW_DEV_SEED must NOT be set,
 *   so this route will behave as if it does not exist (404 Not Found).
 */
@Controller('dev')
export class DevSeedController {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly rbacService: RbacService
  ) {}

  /**
   * POST /dev/seed-initial
   * ----------------------
   * Creates an initial demo tenant and admin user, if no users exist yet.
   *
   * Guarded by the ALLOW_DEV_SEED environment variable.
   */
  @Post('seed-initial')
  async seedInitial(@Body() body: any) {
    // If ALLOW_DEV_SEED is not explicitly enabled, pretend this route
    // does not exist. This prevents accidental use in production.
    if (process.env.ALLOW_DEV_SEED !== 'true') {
      throw new NotFoundException();
    }

    // Optional: allow overriding default credentials via request body.
    const email: string = body?.email || 'admin@zivabi.local';
    const password: string = body?.password || 'ZivaBIAdmin123!';

    // If any users already exist, we assume seeding has been done before.
    const userCount = await this.userRepo.count();
    if (userCount > 0) {
      return {
        status: 'skipped',
        reason: 'users_already_exist'
      };
    }

    // 1) Create a demo tenant.
    let tenant = this.tenantRepo.create({
      name: 'Demo Tenant 1',
      isActive: true
    });
    tenant = await this.tenantRepo.save(tenant);

    // 2) Hash the password securely using bcrypt.
    const passwordHash = await bcrypt.hash(password, 10);

    // 3) Create the admin user.
    let user = this.userRepo.create({
      email,
      displayName: 'Demo Admin User',
      passwordHash,
      tenantId: tenant.id,
      isActive: true
    });
    user = await this.userRepo.save(user);

    // 4) Ensure an admin role + permission and assign them.
    const adminRole = await this.rbacService.ensureRole(
      tenant.id,
      'TENANT_ADMIN',
      'Tenant Administrator'
    );
    const fullAccessPerm = await this.rbacService.ensurePermission(
      'system.full-access',
      'Full access for demo tenant admin'
    );
    await this.rbacService.grantPermissionToRole(adminRole.id, fullAccessPerm.id);
    await this.rbacService.assignRoleToUser(user.id, adminRole.id);

    return {
      status: 'ok',
      tenantId: tenant.id,
      admin: {
        email,
        // We return the raw password ONLY because this is a development-only
        // seeding endpoint. In any other context, passwords must never be logged
        // or returned.
        password
      }
    };
  }

  /**
   * POST /dev/seed-permissions
   * ---------------------------
   * Seeds a basic set of permissions for Expense and AP modules and grants
   * them to the TENANT_ADMIN role for a given tenant.
   *
   * If tenantId is not provided, the first tenant in the database is used.
   */
  @Post('seed-permissions')
  async seedPermissions(@Body() body: any) {
    if (process.env.ALLOW_DEV_SEED !== 'true') {
      throw new NotFoundException();
    }

    // Determine which tenant to target.
    let tenant = null as Tenant | null;
    if (body?.tenantId) {
      tenant = await this.tenantRepo.findOne({ where: { id: body.tenantId } });
    } else {
      // Get the first tenant in the database
      const tenants = await this.tenantRepo.find({ take: 1 });
      tenant = tenants.length > 0 ? tenants[0] : null;
    }

    if (!tenant) {
      throw new NotFoundException('No tenant found for seeding permissions');
    }

    // Ensure the TENANT_ADMIN role exists.
    const adminRole = await this.rbacService.ensureRole(
      tenant.id,
      'TENANT_ADMIN',
      'Tenant Administrator'
    );

    // Core permission keys we want for the demo admin.
    const permissionKeys = [
      'expense.submit',
      'expense.view',
      'expense.finance.review',
      'ap.invoice.view',
      'ap.invoice.submit'
    ];

    const granted: string[] = [];

    for (const key of permissionKeys) {
      const perm = await this.rbacService.ensurePermission(key);
      await this.rbacService.grantPermissionToRole(adminRole.id, perm.id);
      granted.push(key);
    }

    return {
      status: 'ok',
      tenantId: tenant.id,
      roleId: adminRole.id,
      grantedPermissions: granted
    };
  }
}
