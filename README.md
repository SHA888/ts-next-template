# TS Next Template

This is a reusable template for building a full-stack web application using Next.js with TypeScript in 2025. It leverages modern features like App Router, server-side rendering (SSR), static site generation (SSG), and type-safe APIs to create scalable, performant, and SEO-friendly applications.

## Features

- **Next.js 14+**: Utilizes App Router, SSR, SSG, and Edge Functions for optimal performance.
- **TypeScript**: Ensures type safety across frontend and backend, reducing runtime errors.
- **Prisma ORM**: Provides type-safe database operations (configurable for PostgreSQL, MongoDB, etc.).
- **Tailwind CSS**: Enables rapid, responsive UI development with utility-first styling.
- **ESLint & Prettier**: Enforces code quality and consistent formatting.
- **Husky & lint-staged**: Automates linting and formatting on commits.

## Prerequisites

- **Node.js**: Version 18.x or higher.
- **npm or yarn**: For package management.
- **Database**: PostgreSQL, MongoDB, or another Prisma-supported database.
- **Git**: For version control.

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ts-next-template
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add the following:

```
DATABASE_URL="your-database-connection-string"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Replace `DATABASE_URL` with your database connection string (e.g., for PostgreSQL or MongoDB).
### 4. Set Up Prisma

Initialize Prisma and generate the client:

```bash
npx prisma init
npx prisma generate
```

Update the `schema.prisma` file in the `/prisma` directory to define your database models.
### 5. Run the Development Server

Using npm:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.
## Project Structure

```
ts-next-template/
├── app/                    # App Router for pages and API routes
│   ├── api/                # API routes (e.g., /api/users)
│   ├── layout.tsx          # Root layout for the app
│   ├── page.tsx            # Home page
│   └── [...].tsx           # Dynamic routes and other pages
├── lib/                    # Shared utilities and types
│   ├── types.ts            # Shared TypeScript interfaces
│   └── prisma.ts           # Prisma client instance
├── public/                 # Static assets (images, fonts, etc.)
├── styles/                 # Global styles and Tailwind configuration
├── prisma/                 # Prisma schema and migrations
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── next.config.js          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## Available Scripts

- `npm run dev` or `yarn dev`: Starts the development server.
- `npm run build` or `yarn build`: Builds the app for production.
- `npm run start` or `yarn start`: Runs the production build.
- `npm run lint` or `yarn lint`: Runs ESLint to check for code issues.
- `npm run format` or `yarn format`: Formats code with Prettier.
- `npm run prisma:migrate` or `yarn prisma:migrate`: Runs Prisma migrations.

## Best Practices

- **Type Safety**: Use TypeScript interfaces in `/lib/types.ts` for shared types between frontend and backend.
- **API Routes**: Define type-safe API routes in `/app/api` using TypeScript.
- **Database**: Use Prisma for type-safe database queries. Update `schema.prisma` for your models and run migrations.
- **Styling**: Leverage Tailwind CSS for responsive, utility-first styling. Customize in `tailwind.config.js`.
- **Code Quality**: Enforce linting and formatting with ESLint, Prettier, and Husky for consistent code.

## Example Usage

### Creating a Typed API Route

In `/app/api/users/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { User } from '@/lib/types';

export async function GET() {
  const users: User[] = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

### Defining Shared Types

In `/lib/types.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

### Creating a Page

In `/app/page.tsx`:

```tsx
import { User } from '@/lib/types';

interface Props {
  users: User[];
}

export default function Home({ users }: Props) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Welcome to TS Next Template</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Optional Hybrid Approach

For applications requiring complex backend logic (e.g., WebSockets, heavy computations, or custom server setups), you can use a hybrid approach by combining Vercel for the frontend and API routes with a separate backend service. This leverages Vercel's strengths in SSR, SSG, and lightweight APIs while offloading intensive backend tasks to a dedicated server.

### Setup for Hybrid Approach

#### Frontend and Lightweight APIs on Vercel

1. Deploy the Next.js app (this template) to Vercel for SSR, SSG, and API routes (e.g., `/app/api/users`).
2. Configure environment variables in Vercel's dashboard, including `NEXT_PUBLIC_API_URL` for the external backend.

#### Separate Backend Setup

1. Create a Node.js/Express or NestJS backend with TypeScript, hosted on platforms like Render, Fly.io, or AWS.
2. Example structure for the backend:

```
backend/
├── src/
│   ├── controllers/     # API logic (e.g., userController.ts)
│   ├── routes/          # Express routes (e.g., userRoutes.ts)
│   ├── types/           # Shared TypeScript types
│   └── index.ts         # Entry point
├── package.json
├── tsconfig.json
└── .env
```

3. Use the same TypeScript types (e.g., `User` interface) in `/backend/src/types` and `/ts-next-template/lib/types.ts` for consistency.

#### Integration

1. Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to the external backend (e.g., `https://your-backend.render.com`).
2. In the Next.js app, fetch data from the external backend in API routes or server components:

```typescript
// /app/api/external-users/route.ts
import { NextResponse } from 'next/server';
import type { User } from '@/lib/types';

export async function GET() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
  const users: User[] = await response.json();
  return NextResponse.json(users);
}
```

3. Example backend route (`/backend/src/routes/userRoutes.ts`):

```typescript
import express from 'express';
import { User } from '../types';

const router = express.Router();

router.get('/users', async (req, res) => {
  const users: User[] = await getUsersFromDatabase(); // Your DB logic
  res.json(users);
});

export default router;
```

#### Database Integration

1. Connect the external backend to your database (e.g., MongoDB Atlas, PostgreSQL) using Prisma or another ORM.
2. Ensure the Next.js app and backend share the same `schema.prisma` or type definitions for consistency.

#### Deployment

1. Deploy the Next.js app to Vercel as described in the "Deployment" section.
2. Deploy the backend to Render:
   - Push the backend code to a Git repository.
   - Create a new Web Service in Render, link the repository, and set environment variables (e.g., `DATABASE_URL`).
   - Configure CORS to allow requests from the Vercel-hosted frontend.

## Swappable Components and Versatility

The TS Next Template is designed with modularity to allow swapping of most components (e.g., ORM, styling, authentication, backend framework) to suit different project needs while maintaining its Next.js and TypeScript core.

### Example Use Case: Real-time Task Management App

- **Frontend**: Host the Next.js app on Vercel for SSR and lightweight APIs (e.g., user authentication).
- **Backend**: Run a Node.js/Express backend on Render for WebSocket-based real-time updates (e.g., task status changes).
- **Shared Types**: Share `User` and `Task` interfaces between both codebases to ensure type consistency.

### 1. ORM (Prisma)

**Alternatives**: TypeORM, Mongoose (for MongoDB), Sequelize.

#### How to Swap to Mongoose:

1. Replace `/prisma` and `lib/prisma.ts` with Mongoose setup:

```typescript
// lib/mongoose.ts
import mongoose from 'mongoose';
import { User } from '@/lib/types';

const userSchema = new mongoose.Schema<User>({
  id: String,
  name: String,
  email: String,
});

export const UserModel = mongoose.model<User>('User', userSchema);

export const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL!);
};
```

2. Update API route:

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { connectDB, UserModel } from '@/lib/mongoose';
import type { User } from '@/lib/types';

export async function GET() {
  await connectDB();
  const users: User[] = await UserModel.find().exec();
  return NextResponse.json(users);
}
```

3. Update dependencies:
```bash
npm uninstall prisma @prisma/client
npm install mongoose
```

4. Update `.env.local` with the new database connection string.

**Hybrid Approach**: Apply the new ORM to the external backend, ensuring shared types (e.g., `User`) are synchronized.

### 2. Styling (Tailwind CSS)

**Alternatives**: CSS Modules, Styled-Components, Emotion.

#### How to Swap to CSS Modules:

1. Remove Tailwind:
```bash
npm uninstall tailwindcss postcss autoprefixer
rm tailwind.config.js postcss.config.js
```

2. Create a CSS module:
```tsx
// app/page.tsx
import styles from './page.module.css';
import { User } from '@/lib/types';

interface Props {
  users: User[];
}

export default function Home({ users }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to TS Next Template</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} className={styles.item}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

```css
/* app/page.module.css */
.container { 
  margin: 0 auto; 
  padding: 1rem; 
}
.title { 
  font-size: 1.5rem; 
  font-weight: bold; 
}
.item { 
  list-style: none; 
}
```

#### How to Swap to Styled-Components:

1. Install Styled-Components:
```bash
npm install styled-components @types/styled-components
```

2. Update your component:
```tsx
import styled from 'styled-components';
import { User } from '@/lib/types';

const Container = styled.div`
  margin: 0 auto; 
  padding: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem; 
  font-weight: bold;
`;

interface Props {
  users: User[];
}

export default function Home({ users }: Props) {
  return (
    <Container>
      <Title>Welcome to TS Next Template</Title>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </Container>
  );
}
```

**Hybrid Approach**: Styling changes are frontend-only, so the backend remains unaffected.

### 3. Authentication (Clerk, Auth.js)

**Alternatives**: Supabase Auth, Firebase Authentication, custom JWT.

#### How to Swap to Supabase Auth:

1. Install Supabase:
```bash
npm install @supabase/supabase-js
```

2. Configure Supabase client:
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

3. Create an API route for login:
```typescript
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json(data);
}
```

4. Update `.env.local` with your Supabase credentials.

**Hybrid Approach**: The external backend can handle authentication (e.g., JWT) and expose endpoints for the Next.js frontend.

### 4. Code Quality (ESLint, Prettier)

**Alternatives**: Biome, TSLint (deprecated).

#### How to Swap to Biome:

1. Install Biome:
```bash
npm install --save-dev @biomejs/biome
```

2. Create a `biome.json` configuration file:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  }
}
```

3. Update `package.json` scripts:
```json
{
  "scripts": {
    "format": "biome format --write .",
    "lint": "biome lint ."
  }
}
```

4. (Optional) Remove Prettier:
```bash
npm uninstall prettier
rm .prettierrc
```

## Best Practices for Swapping Components

1. **Maintain Type Safety**: Ensure alternatives support TypeScript (e.g., TypeORM, Styled-Components).
2. **Update Dependencies**: Modify `package.json` to add new libraries and remove unused ones.
3. **Test Thoroughly**: Test API routes, components, and backend endpoints after swapping.
4. **Document Changes**: Update documentation to reflect the new setup and configurations.

## Limitations

- **Learning Curve**: Some alternatives may have steeper learning curves than others.
- **Community Support**: Consider the community and maintenance status of the alternatives.
- **Performance Impact**: Some swaps may affect performance (e.g., client-side vs. server-side rendering).
- **Next.js Core**: Swapping Next.js requires a new project template, as the structure is optimized for its features.
- **TypeScript**: Replacing TypeScript with JavaScript undermines type safety, so it's not recommended.

## 5. Git Hooks (Husky, lint-staged)

**Alternatives**: simple-git-hooks, custom scripts.

### How to Swap to simple-git-hooks:

1. Install simple-git-hooks:
```bash
npm install --save-dev simple-git-hooks
```

2. Configure in `package.json`:
```json
{
  "simple-git-hooks": {
    "pre-commit": "npx lint-staged"
  }
}
```

3. Set up the hooks:
```bash
npx simple-git-hooks
```

4. (Optional) Remove Husky and lint-staged:
```bash
npm uninstall husky lint-staged
```

## 6. Backend Framework (Hybrid Approach)

**Alternatives**: NestJS, Fastify, Django, Go.

### How to Swap to NestJS:

1. Create a new NestJS project:
```bash
npx @nestjs/cli new backend
cd backend
```

2. Create a users controller:
```typescript
// backend/src/users/users.controller.ts
import { Controller, Get } from '@nestjs/common';
import { User } from '../types';

@Controller('users')
export class UsersController {
  @Get()
  async findAll(): Promise<User[]> {
    return [{ id: '1', name: 'John', email: 'john@example.com' }]; // Replace with DB logic
  }
}
```

3. Update `NEXT_PUBLIC_API_URL` to point to your new backend (e.g., `https://your-nestjs-backend.com`).
4. Deploy to Render, Fly.io, or AWS.

## Example Use Case: Real-time Chat App

1. **Database**: Swap Prisma for Mongoose if using MongoDB.
2. **Styling**: Replace Tailwind with Styled-Components for dynamic theming.
3. **Authentication**: Use Supabase Auth for user management.
4. **Backend**: In the hybrid approach, swap Express for Fastify for better performance.

## Deployment

### Frontend Deployment (Vercel)

1. Push your code to a Git repository (e.g., GitHub, GitLab, Bitbucket).
2. Connect the repository to Vercel.
3. Configure environment variables in Vercel's dashboard.
4. Deploy with automatic scaling and custom domain setup.

### Backend Deployment (Hybrid Approach)

For the hybrid approach, deploy the backend to a platform like Render, Fly.io, or AWS:

1. **Render**:
   - Push your backend code to a Git repository.
   - Create a new Web Service in Render.
   - Connect your repository and set environment variables.
   - Deploy with automatic scaling.

2. **AWS (Elastic Beanstalk)**:
   - Package your backend application.
   - Upload to Elastic Beanstalk.
   - Configure environment variables and scaling options.
   - Deploy with a single command.

3. **Docker Containers**:
   - Create a `Dockerfile` for your backend.
   - Build and push to a container registry (Docker Hub, AWS ECR).
   - Deploy to any container orchestration platform (Kubernetes, AWS ECS).

## Conclusion

This template provides a solid foundation for building modern web applications with Next.js and TypeScript. Its modular architecture allows you to swap components as your project evolves, ensuring flexibility and maintainability. The hybrid approach enables you to scale your application by offloading complex backend logic to dedicated services when needed.

## Contributing

We welcome contributions to improve this template! Here's how you can help:

1. **Report Issues**: Found a bug or have a feature request? Please [open an issue](https://github.com/SHA888/ts-next-template/issues).
2. **Submit Pull Requests**: Want to contribute code? Fork the repository and submit a pull request.
3. **Improve Documentation**: Better documentation, examples, or tutorials are always appreciated.

### Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Type safety with [TypeScript](https://www.typescriptlang.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Authentication with [NextAuth.js](https://next-auth.js.org/)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Render Documentation](https://render.com/docs)
