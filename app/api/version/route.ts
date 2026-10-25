import prisma from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const latestVersion = await prisma.version.findFirst({
            orderBy: {
                updatedAt: 'desc'
            }
        });

        if (!latestVersion) {
            return NextResponse.json({ message: "No versions found" }, { status: 404 });
        }

        const versionInfo = {
            version: latestVersion.version,
            updatedAt: latestVersion.updatedAt,
        };

        return NextResponse.json(versionInfo);
    } catch (error) {
        console.error("Error fetching version information:", error);
        return NextResponse.json({ message: "Failed to fetch version information" }, { status: 500 });
    }
}

// Optional: Add a POST endpoint for updating the version (admin only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // Here you would add admin check logic
        // For example: if (!isAdmin(session.user.id)) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { version } = body;

        if (!version) {
            return NextResponse.json({ message: "Version is required" }, { status: 400 });
        }

        const newVersion = await prisma.version.create({
            data: {
                version,
            }
        });

        return NextResponse.json(newVersion);
    } catch (error) {
        console.error("Error updating version information:", error);
        return NextResponse.json({ message: "Failed to update version information" }, { status: 500 });
    }
}
