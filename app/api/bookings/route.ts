import { supabase } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const { customer_id, scheduled_at } = body

        if (!customer_id) {
            return NextResponse.json(
                { error: 'customer_id is required' },
                { status: 400 }
            )
        }

        // 1. Create booking
        const { data, error } = await supabase
            .from('bookings')
            .insert({
                customer_id,
                scheduled_at,
                status: 'pending'
            })
            .select()
            .single()

        if (error) throw error

        // 2. Log creation event
        await supabase.from('booking_events').insert({
            booking_id: data.id,
            event_type: 'created',
            from_status: null,
            to_status: 'pending',
            actor_type: 'customer',
            actor_id: customer_id
        })

        return NextResponse.json({ booking: data })
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message ?? 'Internal error' },
            { status: 500 }
        )
    }
}
