import { supabase } from './db'
import { transitionBooking } from './bookingService'

export async function assignProviderToBooking(bookingId: string) {

    if (!bookingId) {
        throw new Error('bookingId is undefined')
    }

    // 1. Find an active provider
    const { data: provider, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single()

    if (error || !provider) {
        throw new Error('No active provider available')
    }

    // 2. Attach provider to booking
    const { error: updateError } = await supabase
        .from('bookings')
        .update({
            provider_id: provider.id
        })
        .eq('id', bookingId)

    if (updateError) throw updateError

    // 3. Transition booking state
    await transitionBooking({
        bookingId,
        nextStatus: 'assigned',
        actorType: 'system',
        metadata: {
            provider_id: provider.id
        }
    })
}
