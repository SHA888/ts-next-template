# Database Setup Guide

This guide explains how to set up and manage the database for this project using Prisma ORM.

## Prerequisites

- Node.js 16+ and npm/yarn
- Docker (for local database instances)
- MongoDB (if using MongoDB)
- PostgreSQL (if using PostgreSQL)

## Environment Variables

Copy the `.env.example` file to `.env` and update the following variables:

```env
# PostgreSQL
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/yourdb?schema=public&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/yourdb?schema=public"

# MongoDB
MONGODB_URI="mongodb://username:password@localhost:27017/yourdb?authSource=admin&retryWrites=true&w=majority"
```

## Database Setup

### Local Development with Docker

1. Start PostgreSQL and MongoDB using Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

3. Seed the database with initial data:
   ```bash
   npx prisma db seed
   ```

## Available Scripts

- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma studio` - Open Prisma Studio to view and edit data
- `npx prisma db seed` - Seed the database with test data

## Database Models

### PostgreSQL Models
- User
- Account
- Session
- Post
- VerificationToken

### MongoDB Models
(Add your MongoDB-specific models here)

## Repository Pattern

The project uses the repository pattern for database access. See `src/lib/prisma/repositories/` for implementation details.

## Best Practices

1. Always create migrations for schema changes
2. Use transactions for operations that modify multiple records
3. Keep business logic in services, not in repositories
4. Use proper indexes for frequently queried fields
5. Regularly backup your database
