import { UserRepository } from './user.repository';
import { PostRepository } from './post.repository';
import { prisma } from '../db';

export const repositories = {
  user: new UserRepository(prisma),
  post: new PostRepository(prisma),
};

export type Repositories = typeof repositories;
