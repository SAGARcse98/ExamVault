import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Toggle favorite / toggle watched
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { action, itemId } = await request.json();
        const userId = (session.user as any).id;

        if (!action || !itemId) {
            return NextResponse.json(
                { error: "Action and itemId are required" },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (action === "toggleFavorite") {
            const index = user.favorites.indexOf(itemId);
            if (index > -1) {
                user.favorites.splice(index, 1);
            } else {
                user.favorites.push(itemId);
            }
        } else if (action === "toggleWatched") {
            const index = user.watchedVideos.indexOf(itemId);
            if (index > -1) {
                user.watchedVideos.splice(index, 1);
            } else {
                user.watchedVideos.push(itemId);
            }
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        await user.save();
        return NextResponse.json({
            favorites: user.favorites,
            watchedVideos: user.watchedVideos,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Get user profile with favorites/watched
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const userId = (session.user as any).id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
