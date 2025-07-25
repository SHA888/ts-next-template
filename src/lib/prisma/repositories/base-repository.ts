import { Prisma, PrismaClient } from '@prisma/client';

type PrismaModelName = keyof typeof Prisma.ModelName;

type PrismaModel = {
  findMany: <T = unknown>(args?: unknown) => Promise<T[]>;
  findUnique: <T = unknown>(args: unknown) => Promise<T | null>;
  create: <T = unknown>(args: unknown) => Promise<T>;
  update: <T = unknown>(args: unknown) => Promise<T>;
  delete: <T = unknown>(args: unknown) => Promise<T>;
  count: (args?: unknown) => Promise<number>;
  deleteMany: (args?: unknown) => Promise<{ count: number }>;
};

// Type for pagination options
interface PaginationOptions {
  page?: number;
  pageSize?: number;
  where?: unknown;
  orderBy?: unknown;
  include?: unknown;
  select?: unknown;
}

// Type for paginated results
interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

type PrismaClientWithModels = {
  [K in Uncapitalize<keyof typeof Prisma.ModelName>]: PrismaModel;
};

export abstract class BaseRepository<ModelName extends PrismaModelName> {
  constructor(protected readonly prisma: PrismaClient) {}

  // Abstract property that must be implemented by child classes
  protected abstract get modelName(): ModelName;

  protected get model(): PrismaModel {
    const modelName = this.modelName;
    if (!modelName) {
      throw new Error(
        'Model name is not defined. Make sure to implement the modelName getter in the child class.'
      );
    }
    const modelKey = (modelName[0].toLowerCase() + modelName.slice(1)) as Uncapitalize<ModelName>;
    const prismaWithModels = this.prisma as unknown as PrismaClientWithModels;
    const model = prismaWithModels[modelKey] as PrismaModel | undefined;

    if (!model) {
      throw new Error(`Model '${modelKey}' not found in Prisma Client`);
    }

    return model;
  }

  async findMany<T = unknown>(args?: unknown): Promise<T[]> {
    return this.model.findMany<T>(args);
  }

  async findUnique<T = unknown>(args: unknown): Promise<T | null> {
    return this.model.findUnique<T>(args);
  }

  async create<T = unknown>(args: unknown): Promise<T> {
    return this.model.create<T>(args);
  }

  async update<T = unknown>(args: unknown): Promise<T> {
    return this.model.update<T>(args);
  }

  async delete<T = unknown>(args: unknown): Promise<T> {
    return this.model.delete<T>(args);
  }

  async count(args?: unknown): Promise<number> {
    return this.model.count(args);
  }

  async deleteMany(args?: unknown): Promise<{ count: number }> {
    return this.model.deleteMany(args || {});
  }

  async paginate<T = unknown>({
    page = 1,
    pageSize = 10,
    where,
    orderBy,
    include,
    select,
  }: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const skip = (page - 1) * pageSize;

    // Build the query parameters with proper typing
    interface QueryParams {
      skip: number;
      take: number;
      where?: unknown;
      orderBy?: unknown;
      include?: unknown;
      select?: unknown;
    }

    const queryParams: QueryParams = { skip, take: pageSize };

    // Only add defined parameters to the query
    if (where) queryParams.where = where;
    if (orderBy) queryParams.orderBy = orderBy;
    if (include) queryParams.include = include;
    if (select) queryParams.select = select;

    // Execute queries in parallel
    const [total, items] = await Promise.all([
      where ? this.count({ where }) : this.count(),
      this.findMany<T>(queryParams),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: items,
      meta: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
