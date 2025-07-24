import { prisma } from '../lib/db';

// Clear the database before each test
beforeEach(async () => {
  await prisma.$transaction([
    prisma.comment.deleteMany({}),
    prisma.post.deleteMany({}),
    prisma.category.deleteMany({}),
    prisma.tag.deleteMany({}),
    prisma.account.deleteMany({}),
    prisma.session.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
