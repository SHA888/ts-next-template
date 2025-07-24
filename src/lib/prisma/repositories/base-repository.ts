import { Prisma, PrismaClient } from '@prisma/client';

export type PaginationOptions = {
  page: number;
  pageSize: number;
  orderBy?: any;
};

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

// Extend the PrismaClient type to include the transaction client
type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>;

export abstract class BaseRepository<T, CreateInput, UpdateInput, WhereUniqueInput, WhereInput, OrderByInput> {
  constructor(protected readonly prisma: PrismaClient) {}

  // Transaction support
  async withTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  // CRUD Operations
  abstract create(data: CreateInput, transaction?: TransactionClient): Promise<T>;
  
  abstract findMany(args?: {
    where?: WhereInput;
    skip?: number;
    take?: number;
    orderBy?: OrderByInput | OrderByInput[];
    include?: any;
    transaction?: TransactionClient;
  }): Promise<T[]>;

  abstract findUnique(
    where: WhereUniqueInput, 
    options?: {
      include?: any;
      transaction?: TransactionClient;
    }
  ): Promise<T | null>;

  abstract update(params: {
    where: WhereUniqueInput;
    data: UpdateInput;
    include?: any;
    transaction?: TransactionClient;
  }): Promise<T>;

  abstract delete(where: WhereUniqueInput, transaction?: TransactionClient): Promise<T>;
  
  // Hard delete implementation (directly deletes the record)
  async hardDelete(where: WhereUniqueInput, transaction?: TransactionClient): Promise<T> {
    const prisma = transaction || this.prisma;
    return (prisma as any)[this.getModelName()].delete({ where });
  }

  // Soft delete implementation
  async softDelete(where: WhereUniqueInput, transaction?: TransactionClient): Promise<T> {
    const prisma = transaction || this.prisma;
    return (prisma as any)[this.getModelName()].update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  // Count with filters
  async count(where?: WhereInput, transaction?: Prisma.TransactionClient): Promise<number> {
    const prisma = transaction || this.prisma;
    return (prisma as any)[this.getModelName()].count({ where });
  }

  // Pagination helper
  async paginate(
    options: PaginationOptions & {
      where?: WhereInput;
      include?: any;
      transaction?: Prisma.TransactionClient;
    }
  ): Promise<PaginatedResult<T>> {
    const { page = 1, pageSize = 10, where, include, orderBy } = options;
    const prisma = options.transaction || this.prisma;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const [total, data] = await Promise.all([
      this.count(where as WhereInput, prisma),
      prisma[this.getModelName()].findMany({
        where,
        skip,
        take,
        orderBy,
        include,
      }) as Promise<T[]>,
    ]);

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // Get model name from class name (e.g., 'UserRepository' -> 'user')
  protected abstract getModelName(): string;
}

// Type helpers for Prisma models will be defined as needed
