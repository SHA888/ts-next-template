# Database Setup Guide

## Prerequisites
- Docker and Docker Compose (recommended)
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- MongoDB (optional)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and update the database connection strings:
   ```env
   # PostgreSQL (required)
   DATABASE_URL="postgresql://user:password@localhost:5432/yourdbname?schema=public"
   
   # MongoDB (optional)
   MONGODB_URI="mongodb://localhost:27017/yourdbname"
   ```

3. **Start Database Services**
   Using Docker Compose:
   ```bash
   # Start PostgreSQL and MongoDB
   npm run db:up
   
   # Or start just PostgreSQL
   docker-compose up -d postgres
   ```

4. **Run Migrations**
   ```bash
   # Run migrations and apply schema
   npm run db:migrate
   
   # Or for production
   npm run db:migrate:deploy
   ```

5. **Seed the Database**
   ```bash
   # Run the seed script
   npm run db:seed
   
   # Or use Prisma directly
   npx prisma db seed
   ```

6. **Access Database**
   ```bash
   # Open Prisma Studio
   npm run db:studio
   
   # Or connect directly
   psql -h localhost -U postgres -d yourdbname
   ```

## Development Workflow

### Creating Migrations
```bash
# Make changes to schema.prisma
npx prisma migrate dev --name your_migration_name

# Reset and re-seed the database
npm run db:reset && npm run db:seed
```

### Common Issues

**Connection Refused**
- Ensure the database service is running
- Check connection string in `.env`
- Verify database credentials

**Migration Issues**
- If migrations fail, try resetting the database:
  ```bash
  npm run db:reset
  ```

## Production Deployment

1. Set up a production database
2. Update environment variables
3. Run migrations:
   ```bash
   NODE_ENV=production npm run db:migrate:deploy
   ```
4. Seed initial data if needed

## Database Backups

```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres -d yourdbname > backup.sql

# MongoDB backup
mongodump --uri="mongodb://localhost:27017/yourdbname" --out=./backup
```

## Troubleshooting

- Check logs: `docker-compose logs -f`
- Reset database: `npm run db:reset`
- Regenerate Prisma client: `npm run db:generate`
