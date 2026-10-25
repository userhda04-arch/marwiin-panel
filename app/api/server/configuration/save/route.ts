import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';
import { getServerPermissions } from '@/lib/getServerPermissions';
import { ActivityType } from '@/types/types';

const defaultConfig = require("@/config/defaultConfig.json")

interface SaveConfigurationRequestBody {
    licenseId: string;
    configuration: any[];
}

function removeOldConfigFeatures(configuration: any) {
    for (const [category, categoryConfig] of Object.entries(configuration)) {
        for (const [featureName, featureValue] of Object.entries(configuration[category])) {
            const doesFeatureExists = defaultConfig[category][featureName]
            if (doesFeatureExists === undefined) {
                delete configuration[category][featureName];
            }
        }
    }

    return configuration
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: SaveConfigurationRequestBody = await req.json();
        const { licenseId, configuration } = body

        if (!licenseId || !configuration) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const sourcePermission = await getServerPermissions(discordId, licenseId)
        if (!sourcePermission || (!sourcePermission.isOwner && !sourcePermission.isDeveloper)) {
            return NextResponse.json({ message: "Invalid Permission" }, { status: 404 });
        }

        const tempConfig = removeOldConfigFeatures(configuration)

        const license = await prisma.license.update({
            where: {
                id: licenseId,
            },
            data: {
                serverConfiguration: tempConfig,
            }
        });

        if (!license) {
            return NextResponse.json({ message: "Invalid License" }, { status: 404 });
        }

        await prisma.server_Activity.create({
            data: {
                licenseId: licenseId,
                action: ActivityType.CONFIG_UPDATE,
                performedBy: session.user.id
            }
        });

        return NextResponse.json({ configuration: configuration }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}