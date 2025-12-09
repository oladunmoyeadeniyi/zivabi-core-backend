import { Column, Entity, Index, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/user.entity';
import { Role } from './role.entity';

/**
 * UserRole
 * --------
 * Assigns roles to users.
 *
 * A user can have multiple roles (e.g., EMPLOYEE + APPROVER), and
 * this table captures those assignments.
 */
@Entity({ name: 'rbac_user_roles' })
@Unique('uq_user_role', ['userId', 'roleId'])
export class UserRole extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_user_role_user_id')
  userId!: string;

  @Column({ name: 'role_id', type: 'uuid' })
  @Index('idx_user_role_role_id')
  roleId!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role!: Role;
}
