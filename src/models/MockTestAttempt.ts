import mongoose, { Schema, Model } from "mongoose";

export interface IAnswerDetail {
    questionIndex: number;
    selectedAnswer: number | null; // null = skipped
    isCorrect: boolean;
    timeTaken: number; // seconds spent on this question
}

export interface IMockTestAttemptDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    mockTestId: mongoose.Types.ObjectId;
    answers: IAnswerDetail[];
    score: number;
    totalCorrect: number;
    totalWrong: number;
    totalSkipped: number;
    startedAt: Date;
    completedAt: Date;
    status: "in-progress" | "completed";
    createdAt: Date;
    updatedAt: Date;
}

const AnswerDetailSchema = new Schema<IAnswerDetail>({
    questionIndex: { type: Number, required: true },
    selectedAnswer: { type: Number, default: null },
    isCorrect: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 },
});

const MockTestAttemptSchema = new Schema<IMockTestAttemptDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        mockTestId: { type: Schema.Types.ObjectId, ref: "MockTest", required: true },
        answers: [AnswerDetailSchema],
        score: { type: Number, default: 0 },
        totalCorrect: { type: Number, default: 0 },
        totalWrong: { type: Number, default: 0 },
        totalSkipped: { type: Number, default: 0 },
        startedAt: { type: Date, default: Date.now },
        completedAt: { type: Date },
        status: { type: String, enum: ["in-progress", "completed"], default: "in-progress" },
    },
    { timestamps: true }
);

// Compound index: one active attempt per user per test
MockTestAttemptSchema.index({ userId: 1, mockTestId: 1 });

const MockTestAttempt: Model<IMockTestAttemptDocument> =
    mongoose.models.MockTestAttempt ||
    mongoose.model<IMockTestAttemptDocument>("MockTestAttempt", MockTestAttemptSchema);

export default MockTestAttempt;
