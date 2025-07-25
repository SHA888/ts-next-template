import { Prisma, PrismaClient } from '@prisma/client';

// Define types for Prisma middleware
type PrismaNextFunction = (params?: Prisma.MiddlewareParams) => Promise<unknown>;

type PrismaMiddleware = (
  params: Prisma.MiddlewareParams,
  next: PrismaNextFunction
) => Promise<unknown>;

// Extend the PrismaClient type to include our custom models
type PrismaClientWithMongo = Omit<PrismaClient, '$use' | '$disconnect'> & {
  $disconnect: () => Promise<void>;
  $use: (middleware: PrismaMiddleware) => void;
};

// Extend the global NodeJS namespace to include our prisma clients
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var mongoPrisma: PrismaClientWithMongo | undefined;
}

// Get the current environment
const nodeEnv = process.env['NODE_ENV'];

// Initialize PostgreSQL Prisma Client
const prisma =
  global.prisma ||
  new PrismaClient({
    log: nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Initialize MongoDB Prisma Client with custom datasource
const mongoPrisma: PrismaClientWithMongo = (() => {
  if (global.mongoPrisma) {
    return global.mongoPrisma;
  }

  const client = new PrismaClient({
    log: nodeEnv === 'development' ? ['error', 'warn'] : ['error'],
    datasourceUrl: process.env.MONGODB_URI,
  }) as PrismaClient as PrismaClientWithMongo;

  // Add middleware for MongoDB operations
  const middleware: PrismaMiddleware = async (params, next) => {
    // Add MongoDB-specific middleware logic here
    // For example, you could add logging or modify queries
    if (params.model === 'UserActivityLog') {
      // Type-safe handling of params.args
      const args = params.args as { data?: Record<string, unknown> };
      const now = new Date();

      // Add timestamp to create operations
      if (params.action === 'create' && args?.data) {
        args.data = {
          ...args.data,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
      }
      // Update timestamp on update operations
      else if (params.action === 'update' && args?.data) {
        args.data = {
          ...args.data,
          updatedAt: now,
        };
      }
    }

    return next(params);
  };

  client.$use(middleware);

  return client;
})();

// Store in global in development to prevent connection limit issues
if (nodeEnv !== 'production') {
  global.prisma = prisma;
  global.mongoPrisma = mongoPrisma;
}

// Export the clients
export { prisma, mongoPrisma };

// Export a function to disconnect all clients
export const disconnect = async (): Promise<void> => {
  try {
    await Promise.all([prisma?.$disconnect(), mongoPrisma?.$disconnect()]);
  } catch (error) {
    console.error('Error disconnecting from databases:', error);
    throw error;
  }
};

// Handle process termination
process.on('beforeExit', async () => {
  await disconnect().catch(console.error);
});

// Re-export Prisma types
export * from '@prisma/client';
