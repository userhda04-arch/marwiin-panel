import prisma from '@/lib/db';
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

interface GetConfigRequestBody {
    configId: string;
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const body: GetConfigRequestBody = await req.json();
        const { configId } = body

        if (!configId) {
            return NextResponse.json({ message: "Invalid Request" }, { status: 404 });
        }

        const config = await prisma.config.findUnique({
            where: {
                id: configId,
            }
        });

        if (!config) {
            return NextResponse.json({ message: "Invalid Config ID" }, { status: 404 });
        }

        return NextResponse.json({ config: config.configuration }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}