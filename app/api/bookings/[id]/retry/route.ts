import { supabase } from '@/lib/db'
import { transitionBooking } from '@/lib/bookingService'
import { assignProviderToBooking } from '@/lib/providerAssignment'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        await transitionBooking({
            bookingId: id,
            nextStatus: 'pending',
            actorType: 'system',
            metadata: { retry: true }
        })

        await assignProviderToBooking(id)

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
