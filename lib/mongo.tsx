import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
//let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

// In production mode, it's best to not use a global variable.
client = new MongoClient(uri, options)
const db = await client.connect()


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default db