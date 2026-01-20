'use client'

import { useState } from 'react'

export default function AdminPage() {
    const [bookingId, setBookingId] = useState('')
    const [message, setMessage] = useState<string | null>(null)

    const assignProvider = async () => {
        setMessage(null)

        const res = await fetch(`/api/bookings/${bookingId}/assign`, {
            method: 'POST'
        })

        const data = await res.json()

        if (!res.ok) {
            setMessage(data.error)
        } else {
            setMessage('✅ Provider assigned')
        }
    }

    return (
        <main style={{ padding: 24 }}>
            <h1>Admin Panel</h1>

            <input
                placeholder="Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                style={{ width: 320, padding: 8 }}
            />

            <br /><br />

            <button onClick={assignProvider}>
                Assign Provider
            </button>

            {message && <p>{message}</p>}
        </main>
    )
}
