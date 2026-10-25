import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { licenseId, banId } = await req.json();

    const license = await prisma.license.findFirst({ where: { id: licenseId } });
    if (!license) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (license.ownerId !== session.user.id) {
        const member = await prisma.server_Member.findFirst({
            where: { licenseId, memberId: session.user.id, isAdmin: true }
        });
        if (!member) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.blacklisted_Id.delete({ where: { id: Number(banId) } });
    return NextResponse.json({ success: true });
}
