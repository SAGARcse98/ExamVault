import mongoose, { Schema, Model } from "mongoose";

export interface IFormulaDocument extends mongoose.Document {
    subjectId: mongoose.Types.ObjectId;
    topicId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const FormulaSchema = new Schema<IFormulaDocument>(
    {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        tags: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

FormulaSchema.index({ subjectId: 1, topicId: 1 });
FormulaSchema.index({ tags: 1 });

const Formula: Model<IFormulaDocument> =
    mongoose.models.Formula ||
    mongoose.model<IFormulaDocument>("Formula", FormulaSchema);

export default Formula;
