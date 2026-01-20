import { getBookingWithEvents } from '@/lib/bookingQuery'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        const result = await getBookingWithEvents(id)

        return NextResponse.json(result)
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: err.message === 'Booking not found' ? 404 : 500 }
        )
    }
}
