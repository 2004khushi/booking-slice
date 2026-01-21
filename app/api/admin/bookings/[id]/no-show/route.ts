import { NextResponse } from 'next/server'
import { transitionBooking } from '@/lib/bookingService'

export async function POST(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id: bookingId } = await context.params

    if (!bookingId) {
        return NextResponse.json(
            { error: 'booking id missing' },
            { status: 400 }
        )
    }

    try {
        const booking = await transitionBooking({
            bookingId,
            nextStatus: 'no_show',
            actorType: 'admin',
            force: true,
            metadata: {
                reason: 'Provider did not arrive within SLA'
            }
        })

        return NextResponse.json({ booking })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
