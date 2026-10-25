import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface GetInfoRequestBody {
    licenseId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const body: GetInfoRequestBody = await req.json();
        const { licenseId } = body

        const license = await prisma.license.findUnique({
            where: {
                id: licenseId
            },
            select: {
                id: true,
                licenseKey: true,
                serverName: true,
                bannerUrl: true,
                serverIp: true,
                serverExpiration: true,
            }
        });

        if (!license) {
            return NextResponse.json({ message: "License doesn't exists" }, { status: 404 });
        }

        let serializedLicense = {
            ...license,
            serverExpiration: license.serverExpiration.toString(),
        };

        const ownLicense = await prisma.license.findUnique({
            where: {
                id: licenseId,
                ownerId: session.user.id,
            },
            select: {
                id: true,
            }
        })

        if (ownLicense) {
            return NextResponse.json({
                license: {
                    ...serializedLicense,
                    isOwner: ownLicense !== undefined,
                }
            }, { status: 200 });
        }

        const accessibleLicense = await prisma.server_Member.findFirst({
            where: {
                memberId: session.user.id,
                licenseId: licenseId
            },
            select: {
                id: true,
                licenseId: true,
                isAdmin: true,
                isDeveloper: true,
            }
        })

        if (accessibleLicense) {
            const licenseResponse = {
                ...serializedLicense,
                isAdmin: accessibleLicense.isAdmin,
                isDeveloper: accessibleLicense.isDeveloper,
                licenseKey: accessibleLicense.isDeveloper ? license.licenseKey : undefined
            };

            return NextResponse.json({
                license: licenseResponse
            }, { status: 200 });
        }

        return NextResponse.json({ license: serializedLicense }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}