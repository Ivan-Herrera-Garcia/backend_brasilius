import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const client = new MongoClient();

// Es mucho mejor usar la variable de entorno, pero si lo pones directo:
const URI = "mongodb+srv://admin1:admin1@organiza.xen4l.mongodb.net/brasilius?authMechanism=SCRAM-SHA-1";

try {
  await client.connect(URI);
  console.log("Conectado a MongoDB Atlas");
} catch (error) {
  console.error("Error conectando:", error);
}

export const db = client.database("brasilius");