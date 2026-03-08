import mongoose, { Schema, Model } from "mongoose";

export interface ISubjectDocument extends mongoose.Document {
    name: string;
    slug: string;
    icon: string;
    description: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const SubjectSchema = new Schema<ISubjectDocument>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
        icon: { type: String, default: "BookOpen" },
        description: { type: String, default: "" },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Subject: Model<ISubjectDocument> =
    mongoose.models.Subject || mongoose.model<ISubjectDocument>("Subject", SubjectSchema);

export default Subject;
