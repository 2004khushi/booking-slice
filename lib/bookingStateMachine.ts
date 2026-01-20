import { BookingStatus } from '@/types/booking'

export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    pending: ['assigned', 'cancelled'],
    assigned: [
        'in_progress',
        'cancelled',
        'pending',
        'failed'
    ],
    in_progress: ['completed', 'failed'],
    completed: [],
    cancelled: [],
    failed: [],
    no_show: []
}
