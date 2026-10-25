import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { getServerPermissions } from '@/lib/getServerPermissions';
import { ActivityType } from '@/types/types';

interface DeleteMemberRequestBody {
    memberId: number;
    licenseId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: DeleteMemberRequestBody = await req.json();
        const { memberId, licenseId } = body

        if (!memberId || !licenseId) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const sourcePermission = await getServerPermissions(discordId, licenseId)
        if (!sourcePermission || !sourcePermission.isOwner) {
            return NextResponse.json({ message: "Invalid Permission" }, { status: 404 });
        }

        await prisma.server_Member.delete({
            where: {
                id: memberId,
                licenseId: licenseId,
            },
        });

        await prisma.server_Activity.create({
            data: {
                licenseId: licenseId,
                action: ActivityType.MEMBER_REMOVE,
                details: `Removed member ${memberId}`,
                performedBy: session.user.id
            }
        });

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}