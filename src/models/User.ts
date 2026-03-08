import mongoose, { Schema, Model } from "mongoose";

export interface IUserDocument extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    favorites: string[];
    watchedVideos: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        favorites: [{ type: String }],
        watchedVideos: [{ type: String }],
    },
    { timestamps: true }
);

const User: Model<IUserDocument> =
    mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default User;
