// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MongoClient } from 'mongodb';

import { env } from '@/env.mjs';

export async function getMongoClient(): Promise<MongoClient> {
  /**
   * Global is used here to maintain a cached connection across hot reloads
   * in development. This prevents connections growing exponentiatlly
   * during API Route usage.
   * https://github.com/vercel/next.js/pull/17666
   */
  if (!global.mongoClientPromise) {
    const client = new MongoClient(env.DB_URI);
    global.mongoClientPromise = client.connect();
  }
  return global.mongoClientPromise;
}

export async function getMongoDb() {
  const mongoClient = await getMongoClient();
  return mongoClient.db();
}
