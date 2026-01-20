import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id: bookingId } = await context.params

    const { data, error } = await supabase
        .from('booking_events')
        .select(`
      created_at,
      from_status,
      to_status,
      actor_type,
      metadata
    `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }

    return NextResponse.json({ timeline: data })
}
