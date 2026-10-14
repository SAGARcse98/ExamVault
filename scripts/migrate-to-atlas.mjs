import { MongoClient } from "mongodb";
import dns from "dns";

import * as fs from "fs";

// Fix DNS for Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let atlasUriFromEnv = process.env.MONGODB_URI;
if (!atlasUriFromEnv && fs.existsSync(".env.local")) {
    const envContent = fs.readFileSync(".env.local", "utf8");
    const match = envContent.match(/^MONGODB_URI=["']?([^"'\r\n]+)["']?/m);
    if (match) atlasUriFromEnv = match[1];
}

const LOCAL_URI = process.env.LOCAL_MONGODB_URI || "mongodb://127.0.0.1:27017";
const ATLAS_URI = atlasUriFromEnv || process.env.ATLAS_URI;
const DB_NAME = "ExamVault";

if (!ATLAS_URI) {
    console.error("❌ Please provide MONGODB_URI in .env.local or environment variable.");
    process.exit(1);
}

async function migrate() {
    console.log("🔌 Connecting to local MongoDB...");
    const localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    const localDb = localClient.db(DB_NAME);

    console.log("☁️  Connecting to Atlas...");
    const atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    const atlasDb = atlasClient.db(DB_NAME);

    console.log("✅ Both connections established!\n");

    const collections = await localDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate:\n`);

    for (const col of collections) {
        const name = col.name;
        const localCollection = localDb.collection(name);
        const atlasCollection = atlasDb.collection(name);

        const docs = await localCollection.find({}).toArray();
        console.log(`📦 ${name}: ${docs.length} documents`);

        if (docs.length === 0) {
            console.log(`   ⏭️  Skipping (empty)\n`);
            continue;
        }

        // Drop existing collection in Atlas to avoid duplicates
        try {
            await atlasCollection.drop();
        } catch (e) {
            // Collection might not exist yet, that's fine
        }

        await atlasCollection.insertMany(docs);
        console.log(`   ✅ Migrated successfully!\n`);
    }

    // Also copy indexes
    console.log("📋 Copying indexes...");
    for (const col of collections) {
        const name = col.name;
        const indexes = await localDb.collection(name).indexes();
        for (const index of indexes) {
            if (index.name === "_id_") continue; // Skip default _id index
            try {
                const { key, ...options } = index;
                delete options.v;
                delete options.ns;
                await atlasDb.collection(name).createIndex(key, options);
                console.log(`   ✅ ${name}: index "${index.name}"`);
            } catch (e) {
                console.log(`   ⚠️  ${name}: index "${index.name}" - ${e.message}`);
            }
        }
    }

    console.log("\n🎉 Migration complete!");

    // Verify
    console.log("\n📊 Verification:");
    for (const col of collections) {
        const localCount = await localDb.collection(col.name).countDocuments();
        const atlasCount = await atlasDb.collection(col.name).countDocuments();
        const status = localCount === atlasCount ? "✅" : "❌";
        console.log(`   ${status} ${col.name}: local=${localCount}, atlas=${atlasCount}`);
    }

    await localClient.close();
    await atlasClient.close();
}

migrate().catch((e) => {
    console.error("❌ Migration failed:", e.message);
    process.exit(1);
});
