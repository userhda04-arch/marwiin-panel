import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const ownedServers = await prisma.license.findMany({
            where: {
                ownerId: session.user.id
            },
            select: {
                id: true,
                serverName: true,
                bannerUrl: true,
                licenseKey: true,
            }
        })

        return NextResponse.json({ownedServers: ownedServers}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}