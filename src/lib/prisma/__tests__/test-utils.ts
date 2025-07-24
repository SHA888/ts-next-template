import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TEST_DATABASE_URL: string;
    }
  }
}

const prismaBinary = join(__dirname, '..', '..', '..', '..', 'node_modules', '.bin', 'prisma');

/**
 * Creates a new test database and runs migrations before tests
 */
export async function setupTestDatabase() {
  // Set test database URL
  const testDbUrl = process.env['TEST_DATABASE_URL'];
  if (!testDbUrl) {
    throw new Error('TEST_DATABASE_URL is not defined in environment variables');
  }
  
  process.env['DATABASE_URL'] = testDbUrl;
  
  // Run migrations
  execSync(`${prismaBinary} migrate deploy`, {
    env: {
      ...process.env,
      DATABASE_URL: testDbUrl,
    },
    stdio: 'inherit',
  });
}

/**
 * Cleans up the test database after tests
 */
export async function teardownTestDatabase() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    
    // Delete all data from tables
    const tables = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename != '_prisma_migrations';
    `;
    
    for (const table of tables as Array<{ tablename: string }>) {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table.tablename}" CASCADE;`
      );
    }
    
    // Reset sequences
    const sequences = await prisma.$queryRaw`
      SELECT sequence_name 
      FROM information_schema.sequences 
      WHERE sequence_schema = 'public';
    `;
    
    for (const seq of sequences as Array<{ sequence_name: string }>) {
      await prisma.$executeRawUnsafe(
        `ALTER SEQUENCE "${seq.sequence_name}" RESTART WITH 1;`
      );
    }
  } catch (error) {
    console.error('Error cleaning up test database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Creates a test Prisma client with a clean state
 */
export function createTestPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env['TEST_DATABASE_URL'],
      },
    },
  });
}
