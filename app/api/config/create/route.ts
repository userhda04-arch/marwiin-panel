import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface CreateConfigRequestBody {
    configuration: any[];
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const body: CreateConfigRequestBody = await req.json();
        const { configuration } = body

        if (!configuration) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const config = await prisma.config.create({
            data: {
                createdBy: session.user.id,
                configuration: configuration,
            }
        });

        return NextResponse.json({ configId: config.id }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}