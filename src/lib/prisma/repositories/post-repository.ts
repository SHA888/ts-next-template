import type { Prisma } from '@prisma/client';
import { BaseRepository } from './base-repository';
import type { PrismaClient } from '@prisma/client';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

declare module '@prisma/client' {
  interface PrismaClient {
    $transaction<T>(fn: (prisma: TransactionClient) => Promise<T>): Promise<T>;
  }
}

type Post = Prisma.PostGetPayload<{
  include: {
    author: true;
    categories: true;
    tags: true;
    media: true;
    _count: { select: { comments: true } };
  };
}>;

export class PostRepository extends BaseRepository<'Post'> {
  protected get modelName() {
    return 'Post' as const;
  }

  // Use the prisma property from BaseRepository
  // No need to override it here
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async create<T = Post>(data: unknown): Promise<T> {
    const postData = data as Prisma.PostCreateInput;
    const prisma = this.prisma;

    const result = await prisma.post.create({
      data: postData,
      include: this.getDefaultInclude(),
    });

    return result as unknown as T;
  }

  private getDefaultInclude(): Prisma.PostInclude {
    return {
      author: true,
      categories: true,
      tags: true,
      media: true,
      _count: { select: { comments: true } },
    };
  }

  async findMany<T = Post[]>(args: unknown): Promise<T> {
    const {
      where,
      orderBy,
      skip,
      take,
      include = {},
      transaction,
    } = args as {
      where?: Prisma.PostWhereInput;
      orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
      skip?: number;
      take?: number;
      include?: Prisma.PostInclude;
      transaction?: TransactionClient;
    };
    const prisma = transaction || this.prisma;

    const results = await prisma.post.findMany({
      where: this.buildWhereClause(where),
      include: {
        author: true,
        categories: true,
        tags: true,
        media: true,
        _count: { select: { comments: true } },
        ...include,
      },
      orderBy,
      skip,
      take,
    });

    return results as unknown as T;
  }

  private buildWhereClause(where?: Prisma.PostWhereInput): Prisma.PostWhereInput | undefined {
    if (!where) return undefined;

    // Type-safe destructuring with type assertion
    const whereInput = where as Prisma.PostWhereInput & {
      categoryId?: string;
      tagId?: string;
      search?: string;
    };

    const { status, categoryId, tagId, search, ...restWhere } = whereInput;
    const conditions: Prisma.PostWhereInput[] = [];

    if (status) conditions.push({ status });
    if (categoryId) conditions.push({ categories: { some: { id: categoryId } } });
    if (tagId) conditions.push({ tags: { some: { id: tagId } } });
    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (conditions.length === 0) {
      return restWhere;
    }

    return {
      ...restWhere,
      AND: conditions,
    };
  }

  async findUnique<T = Post>(args: unknown): Promise<T | null> {
    const {
      where,
      include = {},
      transaction,
    } = args as {
      where: Prisma.PostWhereUniqueInput;
      include?: Prisma.PostInclude;
      transaction?: TransactionClient;
    };
    const prisma = transaction || this.prisma;
    return prisma.post.findUnique({
      where,
      include: {
        author: true,
        categories: true,
        tags: true,
        media: true,
        _count: { select: { comments: true } },
        ...include,
      },
    }) as unknown as T | null;
  }

  async update<T = Post>(args: unknown): Promise<T> {
    const {
      where,
      data,
      include = {},
      transaction,
    } = args as {
      where: Prisma.PostWhereUniqueInput;
      data: Prisma.PostUpdateInput;
      include?: Prisma.PostInclude;
      transaction?: TransactionClient;
    };

    const prisma = transaction || this.prisma;

    // Use type assertion to access $transaction on PrismaClient
    const result = await (prisma as unknown as PrismaClient).$transaction(async (tx) => {
      // First update the post
      const post = await tx.post.update({
        where,
        data,
      });

      // Return the updated post with all relations
      return tx.post.findUnique({
        where: { id: post.id },
        include: {
          author: true,
          categories: true,
          tags: true,
          media: true,
          _count: { select: { comments: true } },
          ...include,
        } as const, // Use const assertion for better type inference
      });
    });

    return result as unknown as T;
  }

  async updatePublishStatus(
    postId: string,
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    transaction?: TransactionClient
  ): Promise<void> {
    const prisma = transaction || (this as unknown as { prisma: PrismaClient }).prisma;
    await prisma.post.update({
      where: { id: postId },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }

  async delete<T = Post>(args: unknown): Promise<T> {
    const { where, transaction } = args as {
      where: Prisma.PostWhereUniqueInput;
      transaction?: TransactionClient;
    };
    const prisma = transaction || this.prisma;
    return prisma.post.delete({
      where,
    }) as unknown as Promise<T>;
  }

  async count(args?: unknown): Promise<number> {
    const { where } = (args || {}) as { where?: Prisma.PostWhereInput };
    return this.prisma.post.count({ where });
  }

  async withTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return fn(tx as TransactionClient);
    });
  }

  async incrementViewCount(postId: string, incrementBy = 1): Promise<Post> {
    // Use a transaction to ensure atomicity
    return this.withTransaction(async (tx) => {
      // First update the view count
      await (
        tx as unknown as {
          $executeRaw: (query: TemplateStringsArray, ...values: unknown[]) => Promise<unknown>;
        }
      ).$executeRaw`
        UPDATE "Post" 
        SET "viewCount" = COALESCE("viewCount", 0) + ${incrementBy}
        WHERE "id" = ${postId}
      `;

      // Then fetch the updated post with all its relations
      const txClient = tx as unknown as {
        post: {
          findUnique: (args: {
            where: { id: string };
            include: Prisma.PostInclude;
          }) => Promise<Post | null>;
        };
      };

      const updatedPost = await txClient.post.findUnique({
        where: { id: postId },
        include: this.getDefaultInclude(),
      });

      if (!updatedPost) {
        throw new Error(`Post with ID ${postId} not found`);
      }

      // Map the result to our Post type with proper null checks
      return {
        ...updatedPost,
        author: updatedPost.author || {
          id: updatedPost.authorId,
          name: null,
          email: null,
          image: null,
        },
        categories: updatedPost.categories || [],
        tags: updatedPost.tags || [],
        media: updatedPost.media || [],
        _count: updatedPost._count || { comments: 0 },
      } as Post;
    });
  }

  // Custom methods specific to Post model
  async findPublishedPosts({
    skip = 0,
    take = 10,
    orderBy = { publishedAt: 'desc' },
  }: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.PostOrderByWithRelationInput | Prisma.PostOrderByWithRelationInput[];
  }): Promise<Post[]> {
    return this.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      skip,
      take,
      orderBy,
    });
  }

  async findPostsByAuthor(authorId: string, includeDrafts = false): Promise<Post[]> {
    return this.findMany({
      where: {
        authorId,
        status: includeDrafts ? undefined : 'PUBLISHED',
        deletedAt: null,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  async publishPost(id: string): Promise<Post> {
    return this.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }
}

// Import Prisma client instance
import { prisma } from '../prisma';

// Singleton instance
export const postRepository = new PostRepository(prisma);
