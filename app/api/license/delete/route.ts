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
                serverExpiration: true,
            }
        });

        if (!license) {
            return NextResponse.json({ message: "License doesn't exists" }, { status: 404 });
        }

        const ownLicense = await prisma.license.findUnique({
            where: {
                id: licenseId,
                ownerId: session.user.id,
            },
            select: {
                id: true,
                serverExpiration: true,
            }
        });

        if (!ownLicense) {
            return NextResponse.json({ message: "You don't own this license" }, { status: 403 });
        }

        if (new Date(Number(ownLicense.serverExpiration) * 1000) > new Date()) {
            return NextResponse.json({ message: "License has not expired" }, { status: 400 });
        }

        await prisma.server_Activity.deleteMany({
            where: {
                licenseId: licenseId,
            }
        });
    
        await prisma.server_Member.deleteMany({
            where: {
                licenseId: licenseId,
            }
        });

        await prisma.license.delete({
            where: {
                id: licenseId,
            }
        });

        return NextResponse.json({ message: "License deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}