import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const backendUrl = process.env.BACKEND_URL;

        if (!backendUrl) {
            return NextResponse.json(
                {
                    status: 'error',
                    message: 'Backend URL is not configured'
                },
                { status: 500 }
            );
        }

        const healthEndpoint = `${backendUrl}/health`;
        const response = await fetch(healthEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Using a short timeout to avoid long waits if backend is down
            signal: AbortSignal.timeout(5000),
            cache: 'no-store'
        });

        if (response.ok) {
            return NextResponse.json(
                {
                    status: 'ok',
                    message: 'Backend is running'
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    status: 'error',
                    message: `Backend health check failed with status: ${response.status}`
                },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error('Error checking backend health:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: `Failed to connect to backend: ${error instanceof Error ? error.message : 'Unknown error'}`
            },
            { status: 503 }
        );
    }
}
