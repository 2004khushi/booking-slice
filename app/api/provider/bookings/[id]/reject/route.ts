
const MAX_RETRIES = 2


import { NextResponse } from 'next/server'
import { transitionBooking } from '@/lib/bookingService'
import { supabase } from '@/lib/db'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: bookingId } = await params
        const body = await request.json().catch(() => ({}))
        const { reason } = body

        const providerId = '7cf98000-c532-4ecc-93a3-005ed51ff93f'

        // fetch current retry_count
        const { data: booking } = await supabase
            .from('bookings')
            .select('retry_count')
            .eq('id', bookingId)
            .single()

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // CASE 1: retry allowed
        if (booking.retry_count < MAX_RETRIES) {
            await transitionBooking({
                bookingId,
                nextStatus: 'pending',
                actorType: 'provider',
                actorId: providerId,
                metadata: { reason, retry: booking.retry_count + 1 }
            })

            // increment retry_count
            await supabase
                .from('bookings')
                .update({ retry_count: booking.retry_count + 1 })
                .eq('id', bookingId)

            return NextResponse.json({
                status: 'retrying',
                retry_count: booking.retry_count + 1
            })
        }

        // CASE 2: retries exhausted → fail booking
        await transitionBooking({
            bookingId,
            nextStatus: 'failed',
            actorType: 'provider',
            actorId: providerId,
            metadata: { reason }
        })

        return NextResponse.json({
            status: 'failed',
            message: 'Max retries exhausted'
        })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message ?? 'Internal error' },
            { status: 500 }
        )
    }
}
