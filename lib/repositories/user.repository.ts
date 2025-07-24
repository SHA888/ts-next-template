import { Prisma, User, UserRole } from '@prisma/client';
import { BaseRepository } from './base.repository';

type UserInclude = {
  posts?: boolean;
  comments?: boolean;
  accounts?: boolean;
  sessions?: boolean;
};

type UserWithRelations<T extends UserInclude = {}> = Prisma.UserGetPayload<{
  include: T;
}>;

type FindUserOptions<T extends UserInclude = {}> = {
  include?: T;
};

export class UserRepository extends BaseRepository<User> {
  protected get model() {
    return this.prisma.user;
  }

  async findByEmail<T extends UserInclude = {}>(
    email: string, 
    options?: FindUserOptions<T>
  ): Promise<UserWithRelations<T> | null> {
    return this.findUnique({ email }, options) as Promise<UserWithRelations<T> | null>;
  }

  async findById<T extends UserInclude = {}>(
    id: string, 
    options?: FindUserOptions<T>
  ): Promise<UserWithRelations<T> | null> {
    return this.findUnique({ id }, options) as Promise<UserWithRelations<T> | null>;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.update({ id: userId }, { password: hashedPassword });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update({ id: userId }, { lastLogin: new Date() });
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return this.update({ id: userId }, data);
  }

  async findByResetToken(resetToken: string): Promise<User | null> {
    return this.findUnique({
      resetToken,
      resetTokenExpiry: {
        gt: new Date()
      }
    });
  }

  async setResetToken(userId: string, token: string, expiryHours: number = 24): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiryHours);
    
    await this.update(
      { id: userId },
      {
        resetToken: token,
        resetTokenExpiry: expiryDate
      }
    );
  }

  async clearResetToken(userId: string): Promise<void> {
    await this.update(
      { id: userId },
      {
        resetToken: null,
        resetTokenExpiry: null
      }
    );
  }

  async changeRole(userId: string, role: UserRole): Promise<User> {
    return this.update({ id: userId }, { role });
  }

  async deactivateUser(userId: string): Promise<User> {
    return this.update(
      { id: userId },
      { 
        isActive: false,
        deactivatedAt: new Date() 
      }
    );
  }

  async activateUser(userId: string): Promise<User> {
    return this.update(
      { id: userId },
      { 
        isActive: true,
        deactivatedAt: null 
      }
    );
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.count({ role, isActive: true });
  }

  async searchUsers<T extends UserInclude = {}>(
    query: string, 
    options: {
      role?: UserRole;
      isActive?: boolean;
      skip?: number;
      take?: number;
      include?: T;
    } = {}
  ): Promise<{ users: UserWithRelations<T>[]; total: number }> {
    const { role, isActive, skip = 0, take = 10 } = options;
    
    const where: Prisma.UserWhereInput = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const [users, total] = await Promise.all([
      this.findMany(where, { 
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: options.include
      }) as Promise<UserWithRelations<T>[]>,
      this.count(where)
    ]);

    return { users, total };
  }
}
