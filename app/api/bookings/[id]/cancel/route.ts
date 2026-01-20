import { supabase } from '@/lib/db'
import { transitionBooking } from '@/lib/bookingService'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const { reason } = await req.json()

        await supabase
            .from('bookings')
            .update({
                cancelled_by: 'customer'
            })
            .eq('id', id)

        await transitionBooking({
            bookingId: id,
            nextStatus: 'cancelled',
            actorType: 'customer',
            metadata: { reason }
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
