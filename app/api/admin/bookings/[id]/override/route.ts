import { NextResponse } from 'next/server'
import { transitionBooking } from '@/lib/bookingService'

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookingId } = await context.params  // ✅ FIX

        if (!bookingId) {
            return NextResponse.json(
                { error: 'booking id missing in route' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { status, reason } = body

        if (!status) {
            return NextResponse.json(
                { error: 'status is required' },
                { status: 400 }
            )
        }

        const booking = await transitionBooking({
            bookingId,
            nextStatus: status,
            actorType: 'admin',
            metadata: { reason }
        })

        return NextResponse.json({ booking })
    } catch (err: any) {
        console.error('ADMIN OVERRIDE ERROR:', err)
        return NextResponse.json(
            { error: err.message ?? 'Internal error' },
            { status: 500 }
        )
    }
}
