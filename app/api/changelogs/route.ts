import { NextResponse } from "next/server"
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from 'next-auth/next';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ message: "Invalid Session" }, { status: 401 })

        const commits = await (
            await fetch("https://api.github.com/repos/AYZNN/MarWiinV4/commits?per_page=20", {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`
                }
            })
        ).json();
        
        if (!commits) {
            return NextResponse.json({ message: "Something went wrong :/" }, { status: 401 });
        }

        return NextResponse.json({ commits: commits, message: "Successfully retrieved commits" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Something went wrong :/" }, { status: 500 });
    }
}