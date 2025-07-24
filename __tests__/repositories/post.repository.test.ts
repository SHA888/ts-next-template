import { hash } from 'bcryptjs';
import { repositories } from '../../lib/repositories';
import { prisma } from '../../lib/db';

describe('PostRepository', () => {
  let testUser: any;

  beforeEach(async () => {
    // Create a test user
    testUser = await repositories.user.create({
      email: 'test@example.com',
      name: 'Test User',
      password: await hash('password123', 12),
      role: 'USER',
      isActive: true,
    });

    // Clear other data
    await prisma.post.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.tag.deleteMany({});
  });

  it('should create a new post', async () => {
    const postData = {
      title: 'Test Post',
      slug: 'test-post',
      content: 'This is a test post',
      status: 'DRAFT' as const,
      authorId: testUser.id,
    };

    const post = await repositories.post.create(postData);

    expect(post).toHaveProperty('id');
    expect(post.title).toBe(postData.title);
    expect(post.slug).toBe(postData.slug);
    expect(post.status).toBe('DRAFT');
    expect(post.authorId).toBe(testUser.id);
  });

  it('should find a post with relations', async () => {
    // Create a post with categories and tags
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
      },
    });

    const tag = await prisma.tag.create({
      data: {
        name: 'Test Tag',
        slug: 'test-tag',
      },
    });

    const post = await repositories.post.create({
      title: 'Test Post',
      slug: 'test-post',
      content: 'This is a test post',
      status: 'PUBLISHED',
      authorId: testUser.id,
      categories: {
        connect: [{ id: category.id }],
      },
      tags: {
        connect: [{ id: tag.id }],
      },
    });

    // Find the post with relations
    const foundPost = await repositories.post.findWithRelations(post.id);

    expect(foundPost).not.toBeNull();
    expect(foundPost?.title).toBe('Test Post');
    expect(foundPost?.categories).toBeDefined();
    expect(Array.isArray(foundPost?.categories)).toBe(true);
    expect(foundPost?.categories?.[0]?.name).toBe('Test Category');
    expect(foundPost?.tags).toBeDefined();
    expect(Array.isArray(foundPost?.tags)).toBe(true);
    expect(foundPost?.tags?.[0]?.name).toBe('Test Tag');
    expect(foundPost?.author?.id).toBe(testUser.id);
  });

  it('should update a post', async () => {
    const post = await repositories.post.create({
      title: 'Original Title',
      slug: 'original-slug',
      content: 'Original content',
      status: 'DRAFT',
      authorId: testUser.id,
    });

    const updatedPost = await repositories.post.update(
      { id: post.id },
      { 
        title: 'Updated Title',
        status: 'PUBLISHED' as const,
      }
    );

    expect(updatedPost.title).toBe('Updated Title');
    expect(updatedPost.status).toBe('PUBLISHED');
  });

  it('should delete a post', async () => {
    const post = await repositories.post.create({
      title: 'Test Post',
      slug: 'test-post',
      content: 'This is a test post',
      status: 'PUBLISHED',
      authorId: testUser.id,
    });

    await repositories.post.delete({ id: post.id });
    const foundPost = await repositories.post.findUnique({ id: post.id });

    expect(foundPost).toBeNull();
  });
});
