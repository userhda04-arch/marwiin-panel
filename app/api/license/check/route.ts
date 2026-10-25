import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface CheckLicenseRequestBody {
    licenseKey: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const body: CheckLicenseRequestBody = await req.json();
        const { licenseKey } = body

        if (!licenseKey || licenseKey.length < 10) {
            return NextResponse.json({ message: "Invalid_Key" }, { status: 200 });
        }

        const licenseExists = await prisma.license.findFirst({
            where: {
                licenseKey: {
                    mode: 'insensitive',
                    equals: licenseKey,
                }
            },
            select: {
                ownerId: true,
            }
        });

        if (licenseExists) {
            if (licenseExists.ownerId === session.user.id) {
                return NextResponse.json({ message: "Already_Redeemed_Me" }, { status: 200 });
            }
            return NextResponse.json({ message: "Already_Redeemed" }, { status: 200 });
        }

        const license = await prisma.redeemable.findFirst({
            where: {
                licenseKey: {
                    mode: 'insensitive',
                    equals: licenseKey,
                }
            }
        });

        if (!license) {
            return NextResponse.json({ message: "Invalid_Key" }, { status: 200 });
        }

        return NextResponse.json({ valid: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}