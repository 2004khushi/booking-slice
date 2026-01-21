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

export const ADMIN_ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    pending: ['cancelled','failed','assigned','no_show'],
    assigned: ['cancelled', 'no_show','failed'],
    in_progress: ['cancelled', 'failed','completed','no_show'],
    failed: ['completed'],
    completed: [],
    cancelled: [],
    no_show: [],
}
