import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { randomUUID } from "crypto";

const OWNER_ID = "1249353959802540104";

const DURATIONS: Record<string, number> = {
    monthly: 30 * 24 * 60 * 60 * 1000,
    quarterly: 90 * 24 * 60 * 60 * 1000,
    yearly: 365 * 24 * 60 * 60 * 1000,
    lifetime: 100 * 365 * 24 * 60 * 60 * 1000,
};

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== OWNER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { ownerId, serverName, expirationType } = await req.json();
    if (!ownerId) return NextResponse.json({ error: "Missing ownerId" }, { status: 400 });

    const licenseKey = "WAVE-" + randomUUID().toUpperCase().replace(/-/g, "").substring(0, 16);
    const id = randomUUID();
    const duration = DURATIONS[expirationType] || DURATIONS.monthly;
    const expiration = BigInt(Date.now() + duration);

    await prisma.license.create({
        data: {
            id,
            ownerId,
            serverName: serverName || "My Server",
            serverExpiration: expiration,
            licenseKey,
            serverConfiguration: {},
        }
    });

    return NextResponse.json({ licenseKey, id });
}
