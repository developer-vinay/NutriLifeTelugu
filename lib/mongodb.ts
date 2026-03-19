import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached: MongooseCache =
  globalWithMongoose.mongooseCache ??
  {
    conn: null,
    promise: null,
  }

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = cached
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'nutrilifetelugu',
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        console.error('MongoDB connection error:', error)
        cached.promise = null
        throw error
      })
  }

  cached.conn = await cached.promise
  return cached.conn
}

