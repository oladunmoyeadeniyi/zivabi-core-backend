import { Column, Entity, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

/**
 * RolePermission
 * --------------
 * Many-to-many join table between roles and permissions.
 *
 * Example: Role 'FINANCE_REVIEWER' may be given permissions:
 * - 'expense.review'
 * - 'ap.invoice.review'
 */
@Entity({ name: 'rbac_role_permissions' })
@Unique('uq_role_permission', ['roleId', 'permissionId'])
export class RolePermission extends BaseEntity {
  @Column({ name: 'role_id', type: 'uuid' })
  @Index('idx_role_permission_role_id')
  roleId!: string;

  @Column({ name: 'permission_id', type: 'uuid' })
  @Index('idx_role_permission_permission_id')
  permissionId!: string;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @ManyToOne(() => Permission, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permission_id' })
  permission!: Permission;
}
