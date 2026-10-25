import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

const OWNER_ID = "1249353959802540104";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== OWNER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const now = BigInt(Date.now());
    const [totalLicenses, activeLicenses, totalBans] = await Promise.all([
        prisma.license.count(),
        prisma.license.count({ where: { isBanned: false } }),
        prisma.blacklisted_Id.count(),
    ]);

    return NextResponse.json({ totalLicenses, activeLicenses, totalBans });
}
