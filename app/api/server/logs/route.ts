import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { licenseId, page = 1, search, type } = await req.json();
    const perPage = 20;

    const license = await prisma.license.findFirst({ where: { id: licenseId } });
    if (!license) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMember = await prisma.server_Member.findFirst({
        where: { licenseId, memberId: session.user.id }
    });
    if (license.ownerId !== session.user.id && !isMember) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const where: any = { licenseId };
    if (type) where.action = type;
    if (search) {
        where.OR = [
            { details: { contains: search, mode: "insensitive" } },
            { performedBy: { contains: search, mode: "insensitive" } },
        ];
    }

    const [logs, total] = await Promise.all([
        prisma.server_Activity.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * perPage,
            take: perPage,
        }),
        prisma.server_Activity.count({ where })
    ]);

    return NextResponse.json({ logs, total });
}
