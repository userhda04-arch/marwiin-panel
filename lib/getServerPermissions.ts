import prisma from '@/lib/db';

interface ServerPermissions {
    isOwner: boolean;
    isAdmin: boolean;
    isDeveloper: boolean;
}

export const getServerPermissions = async (discordId: string, licenseId: string): Promise<ServerPermissions> => {
    const isOwner = await prisma.license.findUnique({
        where: {
            id: licenseId,
            ownerId: discordId
        },
        select: {
            id: true,
        }
    });

    if (isOwner) return { isOwner: true, isAdmin: false, isDeveloper: false }

    const canAccess = await prisma.server_Member.findFirst({
        where: {
            memberId: discordId,
            licenseId: licenseId
        },
        select: {
            id: true,
            isAdmin: true,
            isDeveloper: true,
        }
    })
    

    return { isOwner: false, isAdmin: canAccess && canAccess.isAdmin || false, isDeveloper: canAccess && canAccess.isDeveloper || false }
}