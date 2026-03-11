import mongoose, { Schema, Model } from "mongoose";

export interface INoteDocument extends mongoose.Document {
    subjectId: mongoose.Types.ObjectId;
    topicId: mongoose.Types.ObjectId;
    title: string;
    pdfUrl: string;
    pdfDownloadUrl?: string;
    description: string;
    isImportant: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NoteSchema = new Schema<INoteDocument>(
    {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
        title: { type: String, required: true, trim: true },
        pdfUrl: { type: String, required: true },
        pdfDownloadUrl: { type: String, default: "" },
        description: { type: String, default: "" },
        isImportant: { type: Boolean, default: false },
    },
    { timestamps: true }
);

NoteSchema.index({ subjectId: 1, topicId: 1 });

const Note: Model<INoteDocument> =
    mongoose.models.Note || mongoose.model<INoteDocument>("Note", NoteSchema);

export default Note;
