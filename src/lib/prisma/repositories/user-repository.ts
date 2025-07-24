import { PrismaClient } from '@prisma/client';
import { BaseRepository, PaginatedResult, PaginationOptions } from './base-repository';

// Define transaction client type
type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

// Define user role type
type UserRole = 'USER' | 'ADMIN' | 'EDITOR';

// Define user relation types
type UserWithRelations = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  role: UserRole;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  accounts: Array<{
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
  }>;
  sessions: Array<{
    id: string;
    sessionToken: string;
    userId: string;
    expires: Date;
  }>;
  posts: Array<{
    id: string;
    title: string;
    content: string | null;
    published: boolean;
    authorId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }>;
};

// Define input and output types
type UserCreateInput = {
  name?: string | null;
  email: string;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role?: UserRole;
  isActive?: boolean;
  lastLoginAt?: Date | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | null;
};

type UserUpdateInput = Partial<UserCreateInput>;
type UserWhereUniqueInput = { id: string } | { email: string };
type UserWhereInput = {
  AND?: UserWhereInput | UserWhereInput[];
  OR?: UserWhereInput[];
  NOT?: UserWhereInput | UserWhereInput[];
  id?: string | { equals: string } | { in: string[] };
  email?: string | { equals: string } | { in: string[] } | { contains: string };
  role?: UserRole | { equals: UserRole } | { in: UserRole[] };
  isActive?: boolean | { equals: boolean };
  deletedAt?: Date | null | { equals: Date | null } | { lt?: Date; gt?: Date };
};

type UserOrderByInput = {
  id?: 'asc' | 'desc';
  email?: 'asc' | 'desc';
  name?: 'asc' | 'desc';
  role?: 'asc' | 'desc';
  lastLoginAt?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
};

type UserInclude = {
  accounts?: boolean;
  sessions?: boolean;
  posts?: boolean | {
    where?: {
      published?: boolean;
      deletedAt?: Date | null;
    };
  };
};

// Default includes for user relations
const getDefaultUserInclude = (): UserInclude => ({
  accounts: true,
  sessions: true,
  posts: true,
});

export class UserRepository extends BaseRepository<
  UserWithRelations,
  UserCreateInput,
  UserUpdateInput,
  UserWhereUniqueInput,
  UserWhereInput,
  UserOrderByInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  protected getModelName(): string {
    return 'user';
  }

  async create(data: UserCreateInput, transaction?: TransactionClient): Promise<UserWithRelations> {
    const prisma = transaction || this.prisma;
    return prisma.user.create({ 
      data,
      include: { accounts: true, sessions: true, posts: true }
    }) as Promise<UserWithRelations>;
  }

  async findMany(args: {
    where?: UserWhereInput;
    skip?: number;
    take?: number;
    orderBy?: UserOrderByInput | UserOrderByInput[];
    include?: UserInclude;
    transaction?: TransactionClient;
  } = {}): Promise<UserWithRelations[]> {
    const prisma = args?.transaction || this.prisma;
    return prisma.user.findMany({
      where: args.where,
      skip: args.skip,
      take: args.take,
      orderBy: args.orderBy,
      include: args.include || getDefaultUserInclude(),
    }) as Promise<UserWithRelations[]>;
  }

  async findUnique(
    where: UserWhereUniqueInput, 
    options: {
      include?: UserInclude;
      transaction?: TransactionClient;
    } = {}
  ): Promise<UserWithRelations | null> {
    const prisma = options.transaction || this.prisma;
    return prisma.user.findUnique({ 
      where,
      include: options.include || getDefaultUserInclude(),
    }) as Promise<UserWithRelations | null>;
  }

  async update(params: {
    where: UserWhereUniqueInput;
    data: UserUpdateInput;
    include?: UserInclude;
    transaction?: TransactionClient;
  }): Promise<UserWithRelations> {
    const { where, data, include, transaction } = params;
    const prisma = transaction || this.prisma;
    
    return prisma.user.update({ 
      data,
      include: include || getDefaultUserInclude(),
    }) as Promise<UserWithRelations>;
  }

  async delete(where: UserWhereUniqueInput, transaction?: TransactionClient): Promise<UserWithRelations> {
    const prisma = transaction || this.prisma;
    return prisma.user.update({
      where,
      data: { deletedAt: new Date() },
      include: getDefaultUserInclude(),
    }) as Promise<UserWithRelations>;
  }

  async hardDelete(where: UserWhereUniqueInput, transaction?: TransactionClient): Promise<UserWithRelations> {
    const prisma = transaction || this.prisma;
    return prisma.user.delete({
      where,
      include: getDefaultUserInclude(),
    }) as Promise<UserWithRelations>;
  }

  async count(where?: UserWhereInput, transaction?: TransactionClient): Promise<number> {
    const prisma = transaction || this.prisma;
    const whereClause = where 
      ? { ...where, deletedAt: null }
      : { deletedAt: null };
      
    return prisma.user.count({ where: whereClause });
  }

  async findByEmail(email: string, transaction?: TransactionClient): Promise<UserWithRelations | null> {
    const prisma = transaction || this.prisma;
    return prisma.user.findUnique({ 
      where: { email },
      include: getDefaultUserInclude(),
    });
  }

  async findActiveUsers(transaction?: TransactionClient): Promise<UserWithRelations[]> {
    const prisma = transaction || this.prisma;
    return prisma.user.findMany({
      where: { isActive: true, deletedAt: null },
      include: getDefaultUserInclude(),
    });
  }

  async countByRole(role: UserRole, transaction?: TransactionClient): Promise<number> {
    const prisma = transaction || this.prisma;
    return prisma.user.count({ 
      where: { 
        role,
        deletedAt: null // Only count non-deleted users
      } 
    });
  }

  async findUsersWithPagination(
    options: PaginationOptions & {
      where?: UserWhereInput;
      include?: UserInclude;
      transaction?: TransactionClient;
    } = { page: 1, pageSize: 10 } // Provide default values
  ): Promise<PaginatedResult<UserWithRelations>> {
    const prisma = options.transaction || this.prisma;
    const { page = 1, pageSize = 10, where, include, orderBy } = options;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [total, data] = await Promise.all([
      this.count(where, prisma as any),
      prisma.user.findMany({
        where: where ? { ...where, deletedAt: null } : { deletedAt: null },
        skip,
        take,
        orderBy,
        include: include || getDefaultUserInclude(),
      }),
    ]);

    return {
      data: data as UserWithRelations[],
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async updateLastLogin(userId: string, transaction?: TransactionClient): Promise<UserWithRelations> {
    const prisma = transaction || this.prisma;
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
      include: { accounts: true, sessions: true, posts: true },
    });
  }
}

// Import Prisma client instance
import { prisma } from '../prisma';

// Export a singleton instance
export const userRepository = new UserRepository(prisma);

// Also export the class for testing and dependency injection
export default UserRepository;
