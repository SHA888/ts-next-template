import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './base-repository';

// Extend the PrismaClient type to include the transaction client
type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'> & {
  post: any; // Add type for post model access
};



// Define types based on the Prisma client
type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt: Date | null;
  featured: boolean;
  authorId: string;
  viewCount: number;
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  author: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  media: Array<{
    id: string;
    url: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    name: string;
    size: number;
    width: number | null;
    height: number | null;
    altText: string | null;
  }>;
  _count?: {
    comments: number;
  };
};

type PostCreateInput = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date | null;
  featured?: boolean;
  authorId: string;
  categoryIds?: string[];
  tagIds?: string[];
  seoTitle?: string | null;
  seoDesc?: string | null;
  seoKeywords?: string[];
};

type PostUpdateInput = Partial<Omit<PostCreateInput, 'authorId'>> & {
  categoryIds?: string[];
  tagIds?: string[];
};

type PostWhereUniqueInput = {
  id?: string;
  slug?: string;
};

type PostWhereInput = {
  id?: string | { in: string[] };
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  authorId?: string;
  categoryId?: string;
  tagId?: string;
  search?: string;
  deletedAt?: Date | null;
  AND?: PostWhereInput[];
  OR?: PostWhereInput[];
  NOT?: PostWhereInput | PostWhereInput[];
  [key: string]: unknown; // Allow additional properties
};

type PostOrderByInput = {
  createdAt?: 'asc' | 'desc';
  updatedAt?: 'asc' | 'desc';
  publishedAt?: 'asc' | 'desc';
  title?: 'asc' | 'desc';
  viewCount?: 'asc' | 'desc';
};

export class PostRepository extends BaseRepository<
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostWhereUniqueInput,
  PostWhereInput,
  PostOrderByInput
> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  protected getModelName(): string {
    return 'post';
  }

  async create(data: PostCreateInput, transaction?: TransactionClient): Promise<Post> {
    const prisma = transaction || this.prisma;
    const { categoryIds = [], tagIds = [], ...postData } = data;

    return prisma.post.create({
      data: {
        ...postData,
        categories: categoryIds.length > 0 ? {
          connect: categoryIds.map(id => ({ id }))
        } : undefined,
        tags: tagIds.length > 0 ? {
          connect: tagIds.map(id => ({ id }))
        } : undefined
      },
      include: this.getDefaultInclude()
    });
  }

  private getDefaultInclude() {
    return {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      categories: true,
      tags: true,
      media: true,
      _count: {
        select: {
          comments: true,
        },
      },
    };
  }

  async findMany(args: {
    where?: PostWhereInput;
    skip?: number;
    take?: number;
    orderBy?: PostOrderByInput | PostOrderByInput[];
    include?: any;
    transaction?: TransactionClient;
  } = {}): Promise<Post[]> {
    const prisma = args?.transaction || this.prisma;
    const { where, include, ...otherArgs } = args;
    
    return prisma.post.findMany({
      ...otherArgs,
      where: this.buildWhereClause(where),
      include: {
        ...this.getDefaultInclude(),
        ...include,
      },
    });
  }

  private buildWhereClause(where?: PostWhereInput): Record<string, unknown> | undefined {
    if (!where) return undefined;

    const { status, categoryId, tagId, search, ...restWhere } = where;
    const conditions: Record<string, unknown>[] = [];
    
    if (status) conditions.push({ status });
    if (categoryId) conditions.push({ categories: { some: { id: categoryId } } });
    if (tagId) conditions.push({ tags: { some: { id: tagId } } });
    if (search) {
      conditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      });
    }
    
    const result: Record<string, unknown> = { ...restWhere };
    if (conditions.length > 0) {
      result['AND'] = conditions;
    }
    
    return result;
  }

  async findUnique(
    where: PostWhereUniqueInput, 
    options: {
      include?: any;
      transaction?: TransactionClient;
    } = {}
  ): Promise<Post | null> {
    const prisma = options.transaction || this.prisma;
    return prisma.post.findUnique({
      where,
      include: {
        ...this.getDefaultInclude(),
        ...options.include,
      },
    });
  }

  async update(params: {
    where: PostWhereUniqueInput;
    data: PostUpdateInput;
    include?: any;
    transaction?: TransactionClient;
  }): Promise<Post> {
    const { where, data, include, transaction } = params;
    const prisma = transaction || this.prisma;
    const { categoryIds, tagIds, ...updateData } = data;

    return (prisma as any).$transaction(async (txClient: any) => {
      const tx: TransactionClient = txClient;
      // Update post data
      const post = await txClient.post.update({
        where,
        data: updateData,
        include: include || this.getDefaultInclude(),
      });

// Update categories if provided
      if (categoryIds) {
        await txClient.post.update({
          where: { id: post.id },
          data: {
            categories: {
              set: categoryIds.map((id: string) => ({ id })),
            },
          },
        });
      }

// Update tags if provided
      if (tagIds) {
        await txClient.post.update({
          where: { id: post.id },
          data: {
            tags: {
              set: tagIds.map((id: string) => ({ id })),
            },
          },
        });
      }

      // Return the updated post with all relations
      return this.findUnique({ id: post.id }, { 
        include: include || this.getDefaultInclude(),
        transaction: tx 
      });
    });
  }

  async updatePublishStatus(postId: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', transaction?: TransactionClient): Promise<void> {
    const prisma = transaction || this.prisma;
    await prisma.post.update({
      where: { id: postId },
      data: { 
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
  }

  async delete(where: PostWhereUniqueInput, transaction?: TransactionClient): Promise<Post> {
    const prisma = transaction || this.prisma;
    return prisma.post.update({
      where,
      data: { deletedAt: new Date() },
      include: this.getDefaultInclude(),
    });
  }

  async count(where?: PostWhereInput): Promise<number> {
    return this.prisma.post.count({ where });
  }

  async withTransaction<T>(fn: (tx: TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(async (txClient: any) => {
      const tx = txClient as TransactionClient;
      return fn(tx);
    });
  }

  async incrementViewCount(slug: string, transaction?: TransactionClient): Promise<Post> {
    const prisma = transaction || this.prisma;
    const result = await prisma.post.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      include: this.getDefaultInclude(),
    });
    
    // Map the result to our Post type
    return {
      ...result,
      author: result.author || { id: result.authorId, name: null, email: null, image: null },
      categories: result.categories || [],
      tags: result.tags || [],
      media: result.media || [],
      _count: result._count || { comments: 0 },
    };
  }

  // Custom methods specific to Post model
  async findPublishedPosts({
    skip = 0,
    take = 10,
    orderBy = { publishedAt: 'desc' },
  }: {
    skip?: number;
    take?: number;
    orderBy?: PostOrderByInput | PostOrderByInput[];
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
