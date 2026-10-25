import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { licenseId } = await req.json();

    const license = await prisma.license.findFirst({ where: { id: licenseId } });
    if (!license) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = await prisma.server_Member.findFirst({
        where: { licenseId, memberId: session.user.id }
    });
    if (license.ownerId !== session.user.id && !isMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bans = await prisma.blacklisted_Id.findMany({
        where: { licenseKey: license.licenseKey },
        orderBy: { bannedAt: "desc" }
    });

    return NextResponse.json({ bans });
}
