import { NextResponse } from 'next/server'
import { transitionBooking } from '@/lib/bookingService'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookingId } = await params

        if (!bookingId) {
            return NextResponse.json(
                { error: 'booking id missing in route' },
                { status: 400 }
            )
        }

        const body = await request.json().catch(() => ({}))
        const { reason } = body

        const booking = await transitionBooking({
            bookingId,
            nextStatus: 'cancelled',
            actorType: 'admin',
            metadata: { reason }
        })

        return NextResponse.json({ booking })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message ?? 'Internal error' },
            { status: 500 }
        )
    }
}
