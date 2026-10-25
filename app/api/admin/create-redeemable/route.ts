import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { randomUUID } from "crypto";

const OWNER_ID = "1249353959802540104";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== OWNER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { expirationType, count } = await req.json();
    const num = Math.min(Math.max(parseInt(count) || 1, 1), 50);
    const keys: string[] = [];

    for (let i = 0; i < num; i++) {
        const key = "REDEEM-" + randomUUID().toUpperCase().replace(/-/g, "").substring(0, 12);
        await prisma.redeemable.create({
            data: { licenseKey: key, expirationType, generatedBy: session.user.id }
        });
        keys.push(key);
    }

    return NextResponse.json({ keys });
}
