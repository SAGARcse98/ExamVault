import mongoose, { Schema, Model } from "mongoose";

export interface IQuestion {
    questionText: string;
    options: string[];
    correctAnswer: number; // 0-3 index
    explanation: string;
    marks: number;
}

export interface IMockTestDocument extends mongoose.Document {
    title: string;
    description: string;
    subjectId: mongoose.Types.ObjectId;
    topicId: mongoose.Types.ObjectId;
    duration: number; // minutes
    totalMarks: number;
    negativeMarking: number; // e.g. 0.25
    questions: IQuestion[];
    isPublished: boolean;
    difficulty: "easy" | "medium" | "hard";
    totalQuestions: number;
    createdAt: Date;
    updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    explanation: { type: String, default: "" },
    marks: { type: Number, default: 1 },
});

const MockTestSchema = new Schema<IMockTestDocument>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
        topicId: { type: Schema.Types.ObjectId, ref: "Topic" },
        duration: { type: Number, required: true, default: 30 },
        totalMarks: { type: Number, default: 0 },
        negativeMarking: { type: Number, default: 0.25 },
        questions: [QuestionSchema],
        isPublished: { type: Boolean, default: false },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
        totalQuestions: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const MockTest: Model<IMockTestDocument> =
    mongoose.models.MockTest || mongoose.model<IMockTestDocument>("MockTest", MockTestSchema);

export default MockTest;
