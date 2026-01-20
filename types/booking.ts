export type BookingStatus =
    | 'pending'
    | 'assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'failed'
    | 'no_show'

export type ActorType = 'customer' | 'provider' | 'admin' | 'system'

export interface Booking {
    id: string
    customer_id: string
    provider_id: string | null
    status: BookingStatus
    created_at: string
    updated_at: string
}
