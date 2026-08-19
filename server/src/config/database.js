import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient, ServerApiVersion } from "mongodb";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: envPath });

const uri = process.env.MONGODB_URI || process.env.ATLAS_URI || "";

if (!uri) {
  throw new Error(
    "MongoDB connection string missing. Set MONGODB_URI or ATLAS_URI in the server/.env file."
  );
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

try {
  // Connect the client to the server
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch (err) {
  console.error("MongoDB connection failed:", err);
}

const db = client.db("Nova");

export default db;