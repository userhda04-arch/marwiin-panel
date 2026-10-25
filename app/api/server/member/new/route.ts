import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { getServerPermissions } from '@/lib/getServerPermissions';
import { ActivityType } from '@/types/types';

interface NewMemberRequestBody {
    licenseId: string;
    memberId: string;
    permissions: string[];
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: NewMemberRequestBody = await req.json();
        const { licenseId, memberId, permissions } = body

        if (!licenseId || !memberId || !permissions) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const sourcePermission = await getServerPermissions(discordId, licenseId)
        if (!sourcePermission || !sourcePermission.isOwner) {
            return NextResponse.json({ message: "Invalid Permission" }, { status: 404 });
        }

        const member = await prisma.server_Member.findFirst({
            where: {
                licenseId: licenseId,
                memberId: memberId,
            }
        })

        if (member) {
            await prisma.server_Member.update({
                where: {
                    id: member.id
                },
                data: {
                    isAdmin: permissions.includes("isAdmin") && true || member.isAdmin,
                    isDeveloper: permissions.includes("isDeveloper") && true || member.isDeveloper,
                }
            });
        } else {
            await prisma.server_Member.create({
                data: {
                    licenseId: licenseId,
                    memberId: memberId,
                    isAdmin: permissions.includes("isAdmin"),
                    isDeveloper: permissions.includes("isDeveloper"),
                }
            })
        }

        await prisma.server_Activity.create({
            data: {
                licenseId: licenseId,
                action: ActivityType.MEMBER_ADD,
                details: `Added member ${memberId}`,
                performedBy: session.user.id
            }
        });

        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}