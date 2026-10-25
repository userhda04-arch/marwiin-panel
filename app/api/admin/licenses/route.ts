import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

const OWNER_ID = "1249353959802540104";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== OWNER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const licenses = await prisma.license.findMany({ orderBy: { createdAt: "desc" } });
    // Convert BigInt to string to avoid JSON serialization error
    const serialized = licenses.map(l => ({
        ...l,
        serverExpiration: l.serverExpiration.toString(),
    }));
    return NextResponse.json(serialized);
}
