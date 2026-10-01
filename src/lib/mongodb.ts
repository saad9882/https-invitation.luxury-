import { MongoClient } from "mongodb";

const options = {};

const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Create a lazy-thenable object that acts exactly like a Promise but only
// initiates the database connection when it is actively awaited or .then() is called.
const clientPromise = ({
  then(
    onfulfilled?: ((value: MongoClient) => any) | null,
    onrejected?: ((reason: any) => any) | null
  ): Promise<any> {
    if (!globalWithMongo._mongoClientPromise) {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
      }
      const client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    return globalWithMongo._mongoClientPromise.then(onfulfilled, onrejected);
  }
} as unknown) as Promise<MongoClient>;

export default clientPromise;
export { clientPromise };
