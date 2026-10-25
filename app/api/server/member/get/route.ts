import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface GetMembersRequestBody {
    licenseId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: GetMembersRequestBody = await req.json();
        const { licenseId } = body

        if (!licenseId ) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const members = await prisma.server_Member.findMany({
            where: {
                licenseId: licenseId,
            },
        });

        return NextResponse.json({members: members}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}