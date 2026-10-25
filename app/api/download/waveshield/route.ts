import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import path from "path";
import fs from "fs";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { ActivityType } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();
    const currentTimestamp = Math.floor(now.getTime() / 1000);

    // Check if user has active servers
    const activeServers = await prisma.license.findMany({
      where: {
        ownerId: session.user.id,
        serverExpiration: {
          gt: currentTimestamp,
        },
      },
    });

    if (!activeServers || activeServers.length === 0) {
      return NextResponse.json(
        { message: "No active license found" },
        { status: 403 }
      );
    }

    // Path to the file on the server
    // This assumes you've uploaded the file to the public directory
    // For production, you might want to store this in a more secure location
    const filePath = path.join(process.cwd(), "public", "downloads", "ADN.zip");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);

    // Create response with file
    const response = new NextResponse(fileBuffer);

    // Set appropriate headers
    response.headers.set("Content-Type", "application/zip");
    response.headers.set("Content-Disposition", 'attachment; filename="ADN.zip"');
    response.headers.set("Content-Length", fileBuffer.length.toString());

    await prisma.server_Activity.create({
      data: {
        action: ActivityType.DOWNLOAD,
        performedBy: session.user.id
      }
    });

    return response;
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
