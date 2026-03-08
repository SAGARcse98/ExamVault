import mongoose, { Schema, Model } from "mongoose";

export interface IVideoLectureDocument extends mongoose.Document {
    subjectId: mongoose.Types.ObjectId;
    topicId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    isImportant: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VideoLectureSchema = new Schema<IVideoLectureDocument>(
    {
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject", required: true },
        topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        videoUrl: { type: String, required: true },
        thumbnail: { type: String, default: "" },
        duration: { type: String, default: "" },
        isImportant: { type: Boolean, default: false },
    },
    { timestamps: true }
);

VideoLectureSchema.index({ subjectId: 1, topicId: 1 });

const VideoLecture: Model<IVideoLectureDocument> =
    mongoose.models.VideoLecture ||
    mongoose.model<IVideoLectureDocument>("VideoLecture", VideoLectureSchema);

export default VideoLecture;
