# Database Setup Guide

## Prerequisites
- Docker and Docker Compose
- Node.js 16+

## Setup

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your database credentials.

3. Start the database:
   ```bash
   docker compose up -d
   ```

4. Apply database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Seed the database:
   ```bash
   npx prisma db seed
   ```

## Repository Pattern

We're using a repository pattern to abstract database access:

```typescript
import { repositories } from '@/lib/repositories';

// Example usage
const user = await repositories.user.findByEmail('user@example.com');
const posts = await repositories.post.findMany({ status: 'PUBLISHED' });
```

## Models

### User
- id: String (UUID)
- email: String (unique)
- name: String
- password: String (hashed)
- role: UserRole (ADMIN | USER)
- isActive: Boolean
- createdAt: DateTime
- updatedAt: DateTime

### Post
- id: String (UUID)
- title: String
- slug: String (unique)
- content: String
- status: PostStatus (DRAFT | PUBLISHED | ARCHIVED)
- authorId: String (references User)
- createdAt: DateTime
- updatedAt: DateTime
