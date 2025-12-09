import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

/**
 * UsersService
 * ------------
 * This service is responsible for working with user data.
 *
 * It now uses a TypeORM Repository<User> to talk to the PostgreSQL database,
 * instead of a temporary in-memory list.
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * userRepo
     * --------
     * TypeORM repository to perform CRUD operations on the users table.
     */
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  /**
   * Find a user by their unique identifier.
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  /**
   * Find a user by their email address.
   *
   * This is often used during login, or when sending notifications.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }
}
