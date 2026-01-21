import { supabase } from './db'
import { VALID_TRANSITIONS, ADMIN_ALLOWED_TRANSITIONS } from './bookingStateMachine'
import { Booking, ActorType, BookingStatus } from '@/types/booking'


interface TransitionParams {
    bookingId: string
    nextStatus: BookingStatus
    actorType: ActorType
    actorId?: string
    metadata?: Record<string, any>
    force?: boolean
}


export async function transitionBooking({
                                            bookingId,
                                            nextStatus,
                                            actorType,
                                            actorId,
                                            metadata = {},
                                            force = false
                                        }: TransitionParams) {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

    if (error || !data) {
        throw new Error('Booking not found')
    }

    const booking = data as Booking


    if (actorType === 'admin' && !force) {
        if (!ADMIN_ALLOWED_TRANSITIONS[booking.status].includes(nextStatus)) {
            throw new Error('Admin cannot transition booking from this state');
        }
        //u can comment or remove it out if u want admin to do any transition!
    }
    else if (
        !force &&
        !VALID_TRANSITIONS[booking.status].includes(nextStatus)
    ) {
        throw new Error(
            `Invalid transition from ${booking.status} to ${nextStatus}`
        )
    }





    const rpcPayload: any = {
        booking_id: bookingId,
        from_status: booking.status,
        to_status: nextStatus,
        actor_type: actorType,
        metadata
    }

    if (actorId) {
        rpcPayload.actor_id = actorId
    }

    const { error: rpcError } = await supabase.rpc(
        'transition_booking',
        rpcPayload
    )

    if (rpcError) throw rpcError


    const updated = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single()

    return updated.data


}
