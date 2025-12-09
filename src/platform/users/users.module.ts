import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

/**
 * UsersModule
 * -----------
 * This platform-level module will contain all user-related logic for Ziva BI.
 *
 * Future responsibilities (not all implemented yet):
 * - Managing user profiles (name, email, roles, tenant relations).
 * - Providing helper methods to look up users by id/email.
 * - Acting as the central place where other modules (auth, tenants, RBAC)
 *   retrieve user information.
 */
@Module({
  imports: [
    // Register the User entity so UsersService can use a Repository<User>
    // for database operations.
    TypeOrmModule.forFeature([User])
  ],
  providers: [UsersService],
  exports: [UsersService] // Export so other modules (e.g., AuthModule) can reuse the service.
})
export class UsersModule {}
