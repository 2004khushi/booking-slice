import { supabase } from '@/lib/db'
import { transitionBooking } from '@/lib/bookingService'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        await supabase
            .from('bookings')
            .update({
                failure_reason: 'provider_no_show'
            })
            .eq('id', id)

        await transitionBooking({
            bookingId: id,
            nextStatus: 'failed',
            actorType: 'system',
            metadata: { reason: 'provider_no_show' }
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
