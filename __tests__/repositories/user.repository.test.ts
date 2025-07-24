import { hash } from 'bcryptjs';
import { repositories } from '../../lib/repositories';
import { prisma } from '../../lib/db';

describe('UserRepository', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
  });

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: await hash('password123', 12),
      role: 'USER' as const,
      isActive: true,
    };

    const user = await repositories.user.create(userData);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
    expect(user.name).toBe(userData.name);
    expect(user.role).toBe('USER');
    expect(user.isActive).toBe(true);
  });

  it('should find user by email', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: await hash('password123', 12),
      role: 'USER' as const,
      isActive: true,
    };

    await repositories.user.create(userData);
    const foundUser = await repositories.user.findByEmail(userData.email);

    expect(foundUser).not.toBeNull();
    expect(foundUser?.email).toBe(userData.email);
  });

  it('should update a user', async () => {
    const user = await repositories.user.create({
      email: 'test@example.com',
      name: 'Test User',
      password: await hash('password123', 12),
      role: 'USER' as const,
      isActive: true,
    });

    const updatedUser = await repositories.user.update(
      { id: user.id },
      { name: 'Updated Name' }
    );

    expect(updatedUser.name).toBe('Updated Name');
  });

  it('should delete a user', async () => {
    const user = await repositories.user.create({
      email: 'test@example.com',
      name: 'Test User',
      password: await hash('password123', 12),
      role: 'USER' as const,
      isActive: true,
    });

    await repositories.user.delete({ id: user.id });
    const foundUser = await repositories.user.findUnique({ id: user.id });

    expect(foundUser).toBeNull();
  });
});
