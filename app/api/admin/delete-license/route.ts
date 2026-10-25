import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";

const OWNER_ID = "1249353959802540104";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id !== OWNER_ID) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await req.json();
    await prisma.license.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
