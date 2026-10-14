import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const NoteSchema = new mongoose.Schema({}, { strict: false });
const Note = mongoose.model("Note", NoteSchema, "notes");

async function check() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const notes = await Note.find().sort({ createdAt: -1 }).limit(3);
    console.log(JSON.stringify(notes, null, 2));
    process.exit(0);
}

check();
