import { Prisma, PrismaClient } from '@prisma/client';

export class RepositoryError extends Error {
  constructor(message: string, public code?: string, public meta?: unknown) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export abstract class BaseRepository<T> {
  constructor(protected prisma: PrismaClient) {}

  protected abstract get model(): any;

  protected handleError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new RepositoryError(error.message, error.code, error.meta);
    }
    throw error instanceof Error ? error : new Error(String(error));
  }

  async findMany<WhereInput = any>(
    where?: WhereInput,
    options?: { include?: any; select?: any; skip?: number; take?: number; orderBy?: any }
  ): Promise<T[]> {
    try {
      return await this.model.findMany({ where, ...options });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findUnique<WhereInput = any>(
    where: WhereInput,
    options?: { include?: any; select?: any }
  ): Promise<T | null> {
    try {
      return await this.model.findUnique({ where, ...options });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create<CreateInput = any>(
    data: CreateInput,
    options?: { include?: any; select?: any }
  ): Promise<T> {
    try {
      return await this.model.create({ data, ...options });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update<WhereInput = any, UpdateInput = any>(
    where: WhereInput,
    data: UpdateInput,
    options?: { include?: any; select?: any }
  ): Promise<T> {
    try {
      return await this.model.update({ where, data, ...options });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<WhereInput = any>(
    where: WhereInput,
    options?: { include?: any; select?: any }
  ): Promise<T> {
    try {
      return await this.model.delete({ where, ...options });
    } catch (error) {
      this.handleError(error);
    }
  }

  async count<WhereInput = any>(where?: WhereInput): Promise<number> {
    try {
      return await this.model.count({ where });
    } catch (error) {
      this.handleError(error);
    }
  }
}
