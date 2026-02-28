import mongoose from 'mongoose'

declare global {
  // Allow global `var` declarations
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: mongoose.Connection | null
    promise: Promise<mongoose.Connection> | null
  } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI environment variable')
}

let cached = global.mongooseCache

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    // Connect to MongoDB and store the connection promise
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      return mongoose.connection
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default dbConnect