import { Prisma, Post, PostStatus } from '@prisma/client';
import { BaseRepository } from './base.repository';

type PostInclude = {
  author?: boolean;
  categories?: boolean;
  tags?: boolean;
  comments?: boolean | {
    include?: {
      author?: boolean;
    };
  };
  _count?: boolean | {
    select: {
      comments?: boolean;
      likes?: boolean;
    };
  };
};

type PostWithRelations<T extends PostInclude = {}> = Prisma.PostGetPayload<{
  include: T;
}>;

type FindPostOptions<T extends PostInclude = {}> = {
  include?: T;
  skip?: number;
  take?: number;
  orderBy?: Record<string, 'asc' | 'desc'> | Record<string, 'asc' | 'desc'>[];
};

type CreatePostData = Omit<Prisma.PostCreateInput, 'author' | 'categories' | 'tags'> & {
  authorId: string;
  categoryIds?: string[];
  tagIds?: string[];
};

type UpdatePostData = Partial<CreatePostData>;

export class PostRepository extends BaseRepository<Post> {
  protected get model() {
    return this.prisma.post;
  }

  async findById<T extends PostInclude = {}>(
    id: string,
    options: FindPostOptions<T> = {}
  ): Promise<PostWithRelations<T> | null> {
    return this.findUnique({ id }, options) as Promise<PostWithRelations<T> | null>;
  }

  async findPublished<T extends PostInclude = {}>(
    slug: string,
    options: Omit<FindPostOptions<T>, 'where'> = {}
  ): Promise<PostWithRelations<T> | null> {
    return this.findUnique(
      { 
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() }
      },
      options
    ) as Promise<PostWithRelations<T> | null>;
  }

  async listPublished<T extends PostInclude = {}>(
    options: FindPostOptions<T> & {
      search?: string;
      categorySlug?: string;
      tagSlug?: string;
      authorId?: string;
      featured?: boolean;
    } = {}
  ): Promise<{ posts: PostWithRelations<T>[]; total: number }> {
    const { 
      search, 
      categorySlug, 
      tagSlug, 
      authorId, 
      featured, 
      ...queryOptions 
    } = options;

    const where: Prisma.PostWhereInput = {
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(categorySlug && {
        categories: {
          some: { slug: categorySlug }
        }
      }),
      ...(tagSlug && {
        tags: {
          some: { slug: tagSlug }
        }
      }),
      ...(authorId && { authorId }),
      ...(featured !== undefined && { featured })
    };

    const [posts, total] = await Promise.all([
      this.findMany(where, {
        ...queryOptions,
        orderBy: queryOptions.orderBy || { publishedAt: 'desc' }
      }) as Promise<PostWithRelations<T>[]>,
      this.count(where)
    ]);

    return { posts, total };
  }

  async createPost(data: CreatePostData): Promise<Post> {
    const { categoryIds = [], tagIds = [], ...postData } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // First, create the post with relations
      const post = await tx.post.create({
        data: {
          ...postData,
          categories: categoryIds.length > 0 ? {
            connect: categoryIds.map(id => ({ id }))
          } : undefined,
          tags: tagIds.length > 0 ? {
            connect: tagIds.map(id => ({ id }))
          } : undefined
        },
        include: {
          categories: { select: { id: true } },
          tags: { select: { id: true } }
        }
      });

      // Update category and tag counts using raw SQL to avoid type issues
      if (categoryIds.length > 0) {
        await tx.$executeRaw`
          UPDATE categories 
          SET post_count = post_count + 1 
          WHERE id = ANY(${categoryIds}::uuid[])
        `;
      }

      if (tagIds.length > 0) {
        await tx.$executeRaw`
          UPDATE tags 
          SET post_count = post_count + 1 
          WHERE id = ANY(${tagIds}::uuid[])
        `;
      }

      return post;
    });
  }

  async updatePost(
    id: string, 
    data: UpdatePostData
  ): Promise<Post> {
    const { categoryIds, tagIds, ...postData } = data;
    
    return this.prisma.$transaction(async (tx) => {
      // Get current post with relations
      const currentPost = await tx.post.findUnique({
        where: { id },
        include: {
          categories: { select: { id: true } },
          tags: { select: { id: true } }
        }
      });

      if (!currentPost) {
        throw new Error('Post not found');
      }

      const currentCategoryIds = currentPost.categories.map((c: { id: string }) => c.id);
      const currentTagIds = currentPost.tags.map((t: { id: string }) => t.id);
      
      const categoriesToAdd = categoryIds?.filter((id: string) => !currentCategoryIds.includes(id)) || [];
      const categoriesToRemove = currentCategoryIds.filter((id: string) => !categoryIds?.includes(id));
      
      const tagsToAdd = tagIds?.filter((id: string) => !currentTagIds.includes(id)) || [];
      const tagsToRemove = currentTagIds.filter((id: string) => !tagIds?.includes(id));

      // Update post
      const updatedPost = await tx.post.update({
        where: { id },
        data: {
          ...postData,
          ...(categoriesToAdd.length > 0 && {
            categories: {
              connect: categoriesToAdd.map((id: string) => ({ id }))
            }
          }),
          ...(categoriesToRemove.length > 0 && {
            categories: {
              disconnect: categoriesToRemove.map((id: string) => ({ id }))
            }
          }),
          ...(tagsToAdd.length > 0 && {
            tags: {
              connect: tagsToAdd.map((id: string) => ({ id }))
            }
          }),
          ...(tagsToRemove.length > 0 && {
            tags: {
              disconnect: tagsToRemove.map((id: string) => ({ id }))
            }
          })
        }
      });

      // Update category and tag counts using raw SQL
      if (categoriesToAdd.length > 0) {
        await tx.$executeRaw`
          UPDATE categories 
          SET post_count = post_count + 1 
          WHERE id = ANY(${categoriesToAdd}::uuid[])
        `;
      }

      if (categoriesToRemove.length > 0) {
        await tx.$executeRaw`
          UPDATE categories 
          SET post_count = post_count - 1 
          WHERE id = ANY(${categoriesToRemove}::uuid[])
        `;
      }

      if (tagsToAdd.length > 0) {
        await tx.$executeRaw`
          UPDATE tags 
          SET post_count = post_count + 1 
          WHERE id = ANY(${tagsToAdd}::uuid[])
        `;
      }

      if (tagsToRemove.length > 0) {
        await tx.$executeRaw`
          UPDATE tags 
          SET post_count = post_count - 1 
          WHERE id = ANY(${tagsToRemove}::uuid[])
        `;
      }

      return updatedPost;
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // Get post with relations to update counts
      const post = await tx.post.findUnique({
        where: { id },
        include: {
          categories: { select: { id: true } },
          tags: { select: { id: true } },
          _count: {
            select: { comments: true }
          }
        }
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Delete related records
      await tx.comment.deleteMany({ where: { postId: id } });

      // Delete the post
      await tx.post.delete({ where: { id } });

      // Update category and tag counts using raw SQL
      if (post.categories.length > 0) {
        const categoryIds = post.categories.map(c => c.id);
        await tx.$executeRaw`
          UPDATE categories 
          SET post_count = post_count - 1 
          WHERE id = ANY(${categoryIds}::uuid[])
        `;
      }

      if (post.tags.length > 0) {
        const tagIds = post.tags.map(t => t.id);
        await tx.$executeRaw`
          UPDATE tags 
          SET post_count = post_count - 1 
          WHERE id = ANY(${tagIds}::uuid[])
        `;
      }
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.model.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
  }

  async updateStatus(id: string, status: PostStatus): Promise<Post> {
    const data: Prisma.PostUpdateInput = { status };
    
    if (status === 'PUBLISHED') {
      data.publishedAt = new Date();
    }
    
    return this.update({ id }, data);
  }

  async getRelatedPosts(
    postId: string,
    categoryIds: string[],
    limit: number = 3
  ): Promise<Post[]> {
    if (categoryIds.length === 0) return [];
    
    return this.findMany(
      {
        id: { not: postId },
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        categories: {
          some: { id: { in: categoryIds } }
        }
      },
      {
        take: limit,
        orderBy: { publishedAt: 'desc' }
      }
    ) as Promise<Post[]>;
  }
}
