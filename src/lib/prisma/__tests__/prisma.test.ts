import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { setupTestDatabase, teardownTestDatabase, createTestPrismaClient } from './test-utils';

describe('Prisma Database', () => {
  let prisma: PrismaClient;
  let testUserId: string;
  let testPostId: string;

  beforeAll(async () => {
    // Setup test database and run migrations
    await setupTestDatabase();
    prisma = createTestPrismaClient();
    await prisma.$connect();
  });

  afterEach(async () => {
    // Clean up test data after each test
    await prisma.post.deleteMany({ where: { title: { contains: '[TEST]' } } });
    await prisma.user.deleteMany({ where: { email: { contains: 'test@example.com' } } });
  });

  afterAll(async () => {
    // Clean up and disconnect
    await teardownTestDatabase();
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const password = await hash('test123', 12);
    
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        name: 'Test User',
        password,
        role: 'USER',
        emailVerified: new Date(),
      },
    });

    testUserId = user.id;
    
    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.role).toBe('USER');
  });

  test('should create a new post', async () => {
    if (!testUserId) {
      throw new Error('User ID is not defined. Previous test may have failed.');
    }

    const post = await prisma.post.create({
      data: {
        title: '[TEST] Test Post',
        content: 'This is a test post',
        published: true,
        authorId: testUserId,
      },
    });

    testPostId = post.id;
    
    expect(post).toBeDefined();
    expect(post.title).toBe('[TEST] Test Post');
    expect(post.authorId).toBe(testUserId);
  });

  test('should retrieve posts with author', async () => {
    if (!testPostId) {
      throw new Error('Post ID is not defined. Previous test may have failed.');
    }

    const post = await prisma.post.findUnique({
      where: { id: testPostId },
      include: { author: true },
    });

    expect(post).toBeDefined();
    expect(post?.author).toBeDefined();
    expect(post?.author.name).toBe('Test User');
  });
});
