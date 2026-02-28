import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!
const options = {}

let client
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve the client across hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production, create a new client
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise