import mongoose, { Schema, Model } from "mongoose";

export interface ITopicDocument extends mongoose.Document {
    subjectId: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const TopicSchema = new Schema<ITopicDocument>(
    {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, trim: true, lowercase: true },
    },
    { timestamps: true }
);

TopicSchema.index({ subjectId: 1, slug: 1 }, { unique: true });

const Topic: Model<ITopicDocument> =
    mongoose.models.Topic || mongoose.model<ITopicDocument>("Topic", TopicSchema);

export default Topic;
