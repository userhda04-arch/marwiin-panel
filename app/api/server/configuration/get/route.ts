import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { getServerPermissions } from '@/lib/getServerPermissions';
const defaultConfig = require("@/config/defaultConfig.json")

interface GetConfigurationRequestBody {
    licenseId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: GetConfigurationRequestBody = await req.json();
        const { licenseId } = body

        if (!licenseId ) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const sourcePermission = await getServerPermissions(discordId, licenseId)
        if (!sourcePermission || (!sourcePermission.isOwner && !sourcePermission.isDeveloper)) {
            return NextResponse.json({ message: "Invalid Permission", sourcePermission}, { status: 404 });
        }
        
        const license = await prisma.license.findUnique({
            where: {
                id: licenseId,
            },
            select: {
                serverConfiguration: true,
            }
        });

        if (!license) {
            return NextResponse.json({ message: "Invalid License" }, { status: 404 });
        }

        let configuration: any = license.serverConfiguration

        if (!configuration || configuration === undefined || configuration === null || Object.keys(configuration).length === 0 || configuration.Client) {
            configuration = defaultConfig
        }

        if (!configuration.Premium) {
            configuration.Premium = {}
        }

        if (!configuration.Beta) {
            configuration.Beta = {}
        }

        return NextResponse.json({configuration: configuration}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}