import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { ActivityType } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { memberId, licenseId, permissions } = body;

    if (!memberId || !licenseId || !permissions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // First, check if the member to be updated exists
    const memberToUpdate = await prisma.server_Member.findUnique({
      where: {
        id: parseInt(memberId),
      }
    });

    if (!memberToUpdate) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Check if the license exists
    const license = await prisma.license.findUnique({
      where: {
        id: licenseId,
      }
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    // Check if the current user is an admin for this license
    const currentUserMember = await prisma.server_Member.findFirst({
      where: {
        licenseId: licenseId,
        memberId: session.user.id,
        isAdmin: true
      }
    });

    // Check if the user is the owner of the license
    const isOwner = license.ownerId === session.user.id;

    if (!currentUserMember && !isOwner) {
      return NextResponse.json({ error: "You don't have permission to update members" }, { status: 403 });
    }

    // Update the member with the new permissions
    const updatedMember = await prisma.server_Member.update({
      where: {
        id: parseInt(memberId),
      },
      data: {
        isAdmin: permissions.includes("isAdmin"),
        isDeveloper: permissions.includes("isDeveloper"),
      },
    });

    await prisma.server_Activity.create({
      data: {
        licenseId: licenseId,
        action: ActivityType.MEMBER_UPDATE,
        details: `Updated permissions for member ${memberToUpdate.memberId}`,
        performedBy: session.user.id
      }
    });

    return NextResponse.json({ success: true, member: updatedMember });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json({ error: "An error occurred while updating the member" }, { status: 500 });
  }
}
