import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Setup a minimal schema to test insertion
const NoteSchema = new mongoose.Schema({
    subjectId: { type: mongoose.Schema.Types.ObjectId, required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    isImportant: { type: Boolean, default: false }
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

async function run() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("No MONGODB_URI");

    await mongoose.connect(uri);

    const newNote = await Note.create({
        subjectId: new mongoose.Types.ObjectId('000000000000000000000000'),
        topicId: new mongoose.Types.ObjectId('000000000000000000000000'),
        title: 'Important Thermodynamics PDF',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        isImportant: true
    });

    console.log('Created note', newNote);
    process.exit(0);
}

run().catch(console.error);
