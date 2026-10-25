import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { licenseId, playerId, action, reason } = await req.json();

    const license = await prisma.license.findFirst({ where: { id: licenseId } });
    if (!license) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = await prisma.server_Member.findFirst({
        where: { licenseId, memberId: session.user.id, isAdmin: true }
    });
    if (license.ownerId !== session.user.id && !isMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) return NextResponse.json({ error: "Backend not configured" }, { status: 500 });

    try {
        const res = await fetch(`${backendUrl}/server/player-action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ licenseKey: license.licenseKey, playerId, action, reason, by: session.user.id }),
        });
        if (res.ok) return NextResponse.json({ success: true });
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    } catch {
        return NextResponse.json({ error: "Backend unreachable" }, { status: 500 });
    }
}
