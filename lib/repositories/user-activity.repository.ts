import { Collection } from 'mongodb';
import mongodb, { UserActivityLogDocument, UserActivityMongoDocument } from '../mongodb';

// Re-export the document type for external use
export type UserActivityLog = UserActivityLogDocument;

export interface UserActivityLogCreateInput {
  userId: string;
  action: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    skip: number;
    take: number;
    hasMore: boolean;
  };
}

export class UserActivityRepository {
  private collection!: Collection<UserActivityMongoDocument>;
  private static instance: UserActivityRepository;

  private constructor() {
    this.initialize().catch(console.error);
  }

  public static getInstance(): UserActivityRepository {
    if (!UserActivityRepository.instance) {
      UserActivityRepository.instance = new UserActivityRepository();
    }
    return UserActivityRepository.instance;
  }

  private async initialize() {
    const client = await mongodb;
    this.collection = client.db().collection<UserActivityMongoDocument>('userActivityLogs');
    await this.ensureIndexes();
  }

  private async ensureIndexes() {
    try {
      await this.collection.createIndex({ userId: 1 });
      await this.collection.createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 30 * 24 * 60 * 60 } // 30 days TTL
      );
    } catch (error) {
      console.error('Failed to create indexes:', error);
    }
  }

  async logActivity(data: UserActivityLogCreateInput): Promise<UserActivityLog> {
    const now = new Date();
    const activity: Omit<UserActivityMongoDocument, '_id'> = {
      ...data,
      metadata: data.metadata || null,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(activity as UserActivityMongoDocument);
    return this.toUserActivityLog({
      ...activity,
      _id: result.insertedId,
    });
  }

  private toUserActivityLog(doc: UserActivityMongoDocument): UserActivityLog {
    return {
      _id: doc._id.toString(),
      userId: doc.userId,
      action: doc.action,
      metadata: doc.metadata,
      ipAddress: doc.ipAddress,
      userAgent: doc.userAgent,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async getUserActivities(
    userId: string,
    options: {
      skip?: number;
      take?: number;
      orderBy?: 'asc' | 'desc';
    } = {}
  ): Promise<PaginatedResult<UserActivityLog>> {
    const { skip = 0, take = 20, orderBy = 'desc' } = options;

    const [data, total] = await Promise.all([
      this.collection
        .find({ userId })
        .sort({ createdAt: orderBy === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(take)
        .toArray(),
      this.collection.countDocuments({ userId }),
    ]);

    return {
      data: data.map((doc) => this.toUserActivityLog(doc)),
      pagination: {
        total,
        skip,
        take,
        hasMore: skip + take < total,
      },
    };
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<{ count: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.collection.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    return { count: result.deletedCount || 0 };
  }
}

// Export a singleton instance
export const userActivityRepository = UserActivityRepository.getInstance();
