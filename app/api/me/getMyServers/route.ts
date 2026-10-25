import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const serverMap = new Map();

        const ownedServers = await prisma.license.findMany({
            where: {
                ownerId: session.user.id
            },
            select: {
                id: true,
                serverName: true,
                serverExpiration: true,
                bannerUrl: true,
            }
        })

        ownedServers.forEach(server => {
            serverMap.set(server.id, {
                id: server.id,
                serverName: server.serverName,
                bannerUrl: server.bannerUrl,
                isOwner: true,
                serverExpiration: server.serverExpiration ? Number(server.serverExpiration) : 0
            });
        });

        const accessibleServers = await prisma.server_Member.findMany({
            where: {
                memberId: session.user.id
            },
            select: {
                id: true,
                licenseId: true,
                isAdmin: true,
                isDeveloper: true,
            }
        })

        const licenseIds = accessibleServers.map(server => server.licenseId);
        const licenses = await prisma.license.findMany({
            where: {
                id: {
                    in: licenseIds
                }
            },
            select: {
                id: true,
                serverName: true,
                bannerUrl: true,
                serverExpiration: true,
            }
        });

        accessibleServers.forEach(server => {
            const license = licenses.find(license => license.id === server.licenseId);
            if (license) {
                if (!serverMap.has(server.licenseId)) {
                    serverMap.set(server.licenseId, {
                        id: server.licenseId,
                        serverName: license.serverName || "Unknown",
                        bannerUrl: license.bannerUrl || "",
                        isAdmin: server.isAdmin,
                        isDeveloper: server.isDeveloper,
                        serverExpiration: license.serverExpiration ? Number(license.serverExpiration) : 0
                    });
                }
            }
        });

        const myServers = Array.from(serverMap.values());

        return NextResponse.json({ myServers: myServers }, { status: 200 });
    } catch (error) {
        console.error("Error getting my servers", error);
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}