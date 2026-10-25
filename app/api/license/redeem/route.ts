import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface RedeemLicenseRequestBody {
    licenseKey: string;
    licenseToAddTime?: string;
}

const getLicenseExpiration = (expirationType: string) => {
    let serverExpiration;

    if (expirationType === 'monthly') {
        const now = new Date();
        now.setMonth(now.getMonth() + 1);
        serverExpiration = Math.floor(now.getTime() / 1000);
    } else if (expirationType === 'quarterly') {
        const now = new Date();
        now.setMonth(now.getMonth() + 3);
        serverExpiration = Math.floor(now.getTime() / 1000);
    } else if (expirationType === 'yearly') {
        const now = new Date();
        now.setFullYear(now.getFullYear() + 1);
        serverExpiration = Math.floor(now.getTime() / 1000);
    } else if (expirationType === 'lifetime') {
        const now = new Date();
        now.setFullYear(now.getFullYear() + 10);
        serverExpiration = Math.floor(now.getTime() / 1000);
    }

    return serverExpiration;
}

const getRenewExpiration = (expiration: string, expirationType: string) => {
    let serverExpiration: number = Number(expiration)
    const now = Math.floor(new Date().getTime() / 1000);
    const isExpired = now >= serverExpiration

    if (isExpired) return getLicenseExpiration(expirationType);

    const expirationDate = new Date(serverExpiration * 1000);

    if (expirationType === 'monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        serverExpiration = Math.floor(expirationDate.getTime() / 1000);
    } else if (expirationType === 'quarterly') {
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        serverExpiration = Math.floor(expirationDate.getTime() / 1000);
    } else if (expirationType === 'yearly') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        serverExpiration = Math.floor(expirationDate.getTime() / 1000);
    } else if (expirationType === 'lifetime') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 10);
        serverExpiration = Math.floor(expirationDate.getTime() / 1000);
    }

    return serverExpiration
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })
        const discordId = session.user.id

        const body: RedeemLicenseRequestBody = await req.json();
        const { licenseKey, licenseToAddTime } = body

        if (!licenseKey || licenseKey.length < 10) {
            return NextResponse.json({ message: "Invalid_Key" }, { status: 200 });
        }

        const redeemable = await prisma.redeemable.findFirst({
            where: {
                licenseKey: {
                    equals: licenseKey,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                expirationType: true,
            }
        });
        
        if (!redeemable) {
            return NextResponse.json({ message: "Invalid_Key" }, { status: 200 });
        }

        const serverExpiration = getLicenseExpiration(redeemable.expirationType)
        if (!serverExpiration) {
            return NextResponse.json({ message: "Invalid_Key" }, { status: 200 });
        }

        await prisma.redeemable.delete({
            where: {
                id: redeemable.id,
            }
        })

        let licenseCreated;

        if (licenseToAddTime) {
            const existingLicense = await prisma.license.findUnique({
                where: {
                    id: licenseToAddTime,
                },
                select: {
                    serverExpiration: true
                }
            })

            if (!existingLicense) {
                return NextResponse.json({ message: "Invalid_License_To_Renew" }, { status: 405 });
            }

            const renewExpiration = getRenewExpiration(existingLicense.serverExpiration.toString(), redeemable.expirationType)

            if (!renewExpiration) {
                return NextResponse.json({ message: "Invalid_Renew_Expiration" }, { status: 408 });
            }

            licenseCreated = await prisma.license.update({
                where: {
                    id: licenseToAddTime,
                    ownerId: discordId,
                },
                data: {
                    serverExpiration: renewExpiration,
                }
            });
        } else {
            licenseCreated = await prisma.license.create({
                data: {
                    licenseKey: licenseKey.toLocaleLowerCase(),
                    ownerId: session.user.id,
                    serverExpiration: serverExpiration,
                }
            });
        }

        try {
            await fetch(
                `https://discord.com/api/v10/guilds/${process.env.DISCORD_SERVER_ID}/members/${discordId}/roles/733834739236077620`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        access_token: '',
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bot ${process.env.DISCORD_OAUTH_TOKEN}`,
                    },
                }
            )

        } catch (error) {
            console.log("Failed to add customer role in discord server, error: ", error);
        }

        return NextResponse.json({id: licenseCreated.id}, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}