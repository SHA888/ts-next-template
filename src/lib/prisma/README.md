# Prisma Database Layer

This directory contains the Prisma ORM setup and database access layer for the application.

## Directory Structure

- `prisma/` - Prisma schema and migrations
- `repositories/` - Database repositories implementing the repository pattern
- `__tests__/` - Database tests and test utilities

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Copy `.env.example` to `.env` and update the database connection strings:
   ```bash
   cp .env.example .env
   ```

3. **Start Local Databases with Docker**
   ```bash
   npm run db:up
   ```

4. **Run Database Migrations**
   ```bash
   npm run db:migrate
   ```

5. **Seed the Database**
   ```bash
   npm run db:seed
   ```

## Development

### Running Tests

Run database tests:
```bash
npm run test:db
```

### Database Management

- **Prisma Studio**: `npm run db:studio`
- **Reset Database**: `npm run db:reset`
- **Run Migrations**: `npm run db:migrate`
- **Generate Prisma Client**: `npm run db:generate`

## Repository Pattern

The application uses the repository pattern to abstract database operations. Each model has a corresponding repository class that extends `BaseRepository`.

### Example Repository

```typescript
import { BaseRepository } from './base-repository';
import { PrismaClient } from '@prisma/client';

export class UserRepository extends BaseRepository<User, Prisma.UserCreateInput, Prisma.UserUpdateInput, Prisma.UserWhereUniqueInput, Prisma.UserWhereInput, Prisma.UserOrderByWithRelationInput> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  // Add custom methods here
}
```

## Testing

Database tests use a separate test database. The test environment:

1. Creates a fresh test database
2. Runs migrations
3. Executes tests
4. Cleans up test data

### Writing Tests

```typescript
describe('User Repository', () => {
  let prisma: PrismaClient;
  let userRepository: UserRepository;

  beforeAll(async () => {
    await setupTestDatabase();
    prisma = createTestPrismaClient();
    await prisma.$connect();
    userRepository = new UserRepository(prisma);
  });

  afterEach(async () => {
    await cleanTestData(prisma);
  });

  afterAll(async () => {
    await teardownTestDatabase();
    await prisma.$disconnect();
  });

  test('should create a new user', async () => {
    // Test implementation
  });
});
```

## Best Practices

1. **Use Transactions**: Wrap related database operations in transactions
2. **Error Handling**: Handle database errors appropriately
3. **Type Safety**: Use Prisma's generated types for type safety
4. **Migrations**: Always create migrations for schema changes
5. **Testing**: Write tests for all database operations
