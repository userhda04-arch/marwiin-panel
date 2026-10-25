import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { ActivityType } from '@/types/types';

interface ResetIPRequestBody {
    licenseId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: ResetIPRequestBody = await req.json();
        const { licenseId } = body

        if (!licenseId) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        await prisma.license.update({
            where: {
                id: licenseId,
                ownerId: discordId,
            },
            data: {
                serverIp: null
            }
        });

        await prisma.server_Activity.create({
            data: {
                licenseId: licenseId,
                action: ActivityType.IP_RESET,
                performedBy: session.user.id
            }
        });

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}