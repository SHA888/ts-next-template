import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../lib/db';
import { repositories } from '../lib/repositories';

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.$transaction([
      prisma.comment.deleteMany({}),
      prisma.post.deleteMany({}),
      prisma.category.deleteMany({}),
      prisma.tag.deleteMany({}),
      prisma.account.deleteMany({}),
      prisma.session.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    // Create admin user using repository
    console.log('👤 Creating admin user...');
    const admin = await repositories.user.create({
      id: uuidv4(),
      email: 'admin@example.com',
      name: 'Admin User',
      password: await hash('admin123', 12),
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
    });

    // Create test user using repository
    console.log('👤 Creating test user...');
    const testUser = await repositories.user.create({
      id: uuidv4(),
      name: 'Test User',
      email: 'user@example.com',
      password: await hash('password123', 12),
      emailVerified: new Date(),
      role: 'USER',
      isActive: true,
    });

    // Create categories
    console.log('📂 Creating categories...');
    const categories = await Promise.all(
      ['Technology', 'Business', 'Lifestyle', 'Travel'].map((name) =>
        prisma.category.upsert({
          where: { name },
          update: {},
          create: { 
            id: uuidv4(),
            name, 
            slug: name.toLowerCase(),
            description: `${name} related content`
          },
        })
      )
    );

    // Create tags
    console.log('🏷️ Creating tags...');
    const tags = await Promise.all(
      ['React', 'Next.js', 'TypeScript', 'Prisma', 'Node.js', 'JavaScript'].map((name) =>
        prisma.tag.upsert({
          where: { name },
          update: {},
          create: { 
            id: uuidv4(),
            name, 
            slug: name.toLowerCase()
          },
        })
      )
    );

    // Create sample posts
    console.log('📝 Creating sample posts...');
    
    // Ensure we have enough categories and tags
    if (categories.length < 2 || tags.length < 5) {
      throw new Error('Not enough categories or tags created');
    }

    const posts = [
      {
        title: 'Getting Started with Next.js and Prisma',
        slug: 'getting-started-with-nextjs-and-prisma',
        excerpt: 'Learn how to set up Next.js with Prisma ORM',
        content: 'This is a comprehensive guide on setting up Next.js with Prisma...',
        status: 'PUBLISHED' as const,
        authorId: admin.id,
        categoryIds: [categories[0]?.id],
        tagIds: [tags[0]?.id, tags[1]?.id, tags[2]?.id].filter(Boolean) as string[],
      },
      {
        title: 'Building Scalable APIs with Node.js',
        slug: 'building-scalable-apis-with-nodejs',
        excerpt: 'Learn best practices for building scalable APIs',
        content: 'Building scalable APIs requires careful planning and architecture...',
        status: 'PUBLISHED' as const,
        authorId: testUser.id,
        categoryIds: [categories[0]?.id, categories[1]?.id].filter(Boolean) as string[],
        tagIds: [tags[3]?.id, tags[4]?.id].filter(Boolean) as string[],
      },
    ];

    for (const postData of posts) {
      const { categoryIds, tagIds, ...post } = postData;
      
      // Filter out any undefined IDs and ensure we have valid connections
      const categoryConnections = categoryIds
        .filter((id): id is string => Boolean(id))
        .map(id => ({ id }));
      
      const tagConnections = tagIds
        .filter((id): id is string => Boolean(id))
        .map(id => ({ id }));
      
      await prisma.post.create({
        data: {
          ...post,
          id: uuidv4(),
          publishedAt: new Date(),
          categories: {
            connect: categoryConnections,
          },
          tags: {
            connect: tagConnections,
          },
        },
      });
    }

    console.log('✅ Database has been seeded successfully!');
    console.log('👤 Admin user: admin@example.com / admin123');
    console.log('👤 Regular user: user@example.com / password123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
