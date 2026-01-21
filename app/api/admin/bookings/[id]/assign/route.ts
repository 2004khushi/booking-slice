import { NextResponse } from 'next/server'
import { transitionBooking } from '@/lib/bookingService'

// Define the type for the params promise
type RouteParams = {
    params: Promise<{ id: string }>
}

export async function POST(
    _req: Request,
    { params }: RouteParams
) {
    try {
        // In Next.js 15/16, params is a Promise that must be awaited
        const { id: bookingId } = await params

        if (!bookingId) {
            return NextResponse.json(
                { error: 'booking id missing' },
                { status: 400 }
            )
        }

        // TEMP: system auto-assigns provider
        const providerId = '7cf98000-c532-4ecc-93a3-005ed51ff93f'

        // Transitioning booking status using async/await
        const booking = await transitionBooking({
            bookingId,
            nextStatus: 'assigned',
            actorType: 'admin',
            actorId: providerId,
            metadata: { provider_id: providerId }
        })

        return NextResponse.json({
            success: true,
            booking
        })

    } catch (err: any) {
        console.error('Admin API Error:', err)

        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}