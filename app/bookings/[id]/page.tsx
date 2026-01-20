'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function BookingDetailsPage() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        fetch(`/api/bookings/${id}`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => setError('Failed to load booking'))
    }, [id])

    if (error) return <p>{error}</p>
    if (!data) return <p>Loading...</p>

    const { booking, events } = data

    return (
        <main style={{ padding: 24 }}>
            <h1>Booking Status</h1>

            <p><b>Status:</b> {booking.status}</p>
            <p><b>Provider:</b> {booking.provider_id ?? 'Not assigned'}</p>

            <h2>Timeline</h2>
            <ul>
                {events.map((e: any) => (
                    <li key={e.id}>
                        {e.created_at} — {e.from_status ?? 'start'} → {e.to_status} ({e.actor_type})
                    </li>
                ))}
            </ul>
        </main>
    )
}
