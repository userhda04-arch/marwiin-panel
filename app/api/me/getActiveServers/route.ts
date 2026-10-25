import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const now = new Date();
        const currentTimestamp = Math.floor(now.getTime() / 1000);

        const activeServers = await prisma.license.findMany({
            where: {
                ownerId: session.user.id,
                serverExpiration: {
                    gt: currentTimestamp
                }
            },
            select: {
                id: true,
                serverName: true,
                serverExpiration: true,
                bannerUrl: true,
            }
        })

        const serializedServers = activeServers.map(server => ({
            ...server,
            serverExpiration: Number(server.serverExpiration)
        }));

        return NextResponse.json({ activeServers: serializedServers }, { status: 200 });
    } catch (error) {
        console.error("Error fetching active servers", error);
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}