import { supabase } from './db'

export async function getBookingWithEvents(bookingId: string) {
    if (!bookingId) {
        throw new Error('bookingId is required')
    }

    // 1. Fetch booking
    const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

    if (bookingError || !booking) {
        throw new Error('Booking not found')
    }

    // 2. Fetch events (timeline)
    const { data: events, error: eventsError } = await supabase
        .from('booking_events')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true })

    if (eventsError) {
        throw new Error('Failed to load booking events')
    }

    return {
        booking,
        events
    }
}
