import prisma from '@/lib/db';
import { NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // First, get all licenses owned by the user
        const ownedLicenses = await prisma.license.findMany({
            where: {
                ownerId: session.user.id
            },
            select: {
                id: true,
                serverName: true
            }
        });

        // Then, get all licenseIds where the user is a member with admin or dev permissions
        const memberLicenses = await prisma.server_Member.findMany({
            where: {
                memberId: session.user.id,
                OR: [
                    { isAdmin: true },
                    { isDeveloper: true }
                ]
            },
            select: {
                licenseId: true
            }
        });

        // Get the license details for the member licenses
        const memberLicenseDetails = await prisma.license.findMany({
            where: {
                id: {
                    in: memberLicenses.map(ml => ml.licenseId)
                }
            },
            select: {
                id: true,
                serverName: true
            }
        });

        // Combine both sets of licenses
        const allUserServers = [...ownedLicenses, ...memberLicenseDetails];

        // Get the license keys for all servers the user can manage
        const licenseIds = allUserServers.map(server => server.id);

        // Get the 5 most recent activities for these servers
        const recentActivities = await prisma.server_Activity.findMany({
            where: {
                OR: [
                    {
                        licenseId: {
                            in: licenseIds
                        }
                    },
                    {
                        performedBy: session.user.id
                    }
                ]

            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            select: {
                licenseId: true,
                action: true,
                details: true,
                performedBy: true,
                createdAt: true
            }
        });

        // Map the activities to include server names
        const activitiesWithServerNames = recentActivities.map((activity: any) => {
            const server = allUserServers.find(s => s.id === activity.licenseId);
            const createdAt = activity.createdAt.toISOString();
            return {
                ...activity,
                createdAt,
                serverName: server?.serverName || "Unknown Server"
            };
        });

        return NextResponse.json({ activities: activitiesWithServerNames });
    } catch (error) {
        console.error("Error fetching recent activities:", error);
        return NextResponse.json({ message: "Failed to fetch recent activities" }, { status: 500 });
    }
}
