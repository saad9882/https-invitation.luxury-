import clientPromise from "./mongodb";

export async function getDb() {
  const client = await clientPromise;
  return client.db("wedding_app");
}

let indexesInitialized = false;

export async function initDbIndexes() {
  if (indexesInitialized) return;
  try {
    const db = await getDb();

    // 1. Users Indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true }).catch(() => {});

    // 2. Invitations / Weddings Indexes
    await db.collection("invitations").createIndex({ slug: 1 }, { unique: true }).catch(() => {});
    await db.collection("invitations").createIndex({ userEmail: 1 }).catch(() => {});
    await db.collection("invitations").createIndex({ userId: 1 }).catch(() => {});

    // 3. Guests Indexes
    await db.collection("guests").createIndex({ secureToken: 1 }, { unique: true }).catch(() => {});
    await db.collection("guests").createIndex({ weddingSlug: 1 }).catch(() => {});
    await db.collection("guests").createIndex({ weddingSlug: 1, email: 1 }).catch(() => {});

    // 4. RSVPs Indexes
    await db.collection("rsvps").createIndex({ secureToken: 1 }, { unique: true }).catch(() => {});
    await db.collection("rsvps").createIndex({ weddingSlug: 1 }).catch(() => {});

    indexesInitialized = true;
  } catch (error) {
    console.error("Error initializing DB indexes:", error);
  }
}
