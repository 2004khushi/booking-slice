'use client'

import { useState } from 'react'

export default function CreateBookingPage() {
    const [customerId, setCustomerId] = useState('')
    const [bookingId, setBookingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const createBooking = async () => {
        if (!customerId.trim()) {
            setError('Customer UUID is required')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: customerId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error)
            }

            setBookingId(data.booking.id)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main style={{ minHeight: '100vh', background: '#0f0f0f', padding: 40 }}>
            <div style={{
                maxWidth: 480,
                margin: '0 auto',
                background: '#161616',
                padding: 24,
                borderRadius: 8
            }}>
                <h1 style={{ marginBottom: 16 }}>Create Booking</h1>

                <label style={{ fontSize: 14, opacity: 0.8 }}>
                    Customer UUID
                </label>

                <input
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="e.g. 22222222-1111-1111-1111-111111111111"
                    style={{
                        width: '100%',
                        padding: 10,
                        marginTop: 6,
                        borderRadius: 6,
                        border: '1px solid #333',
                        background: '#0f0f0f',
                        color: 'white'
                    }}
                />

                <button
                    onClick={createBooking}
                    disabled={loading}
                    style={{
                        marginTop: 16,
                        width: '100%',
                        padding: 10,
                        borderRadius: 6,
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Creating...' : 'Create Booking'}
                </button>

                {bookingId && (
                    <p style={{ marginTop: 12, color: '#22c55e' }}>
                        ✅ Booking created<br />
                        <small>{bookingId}</small>
                    </p>
                )}

                {error && (
                    <p style={{ marginTop: 12, color: '#ef4444' }}>
                        {error}
                    </p>
                )}
            </div>
        </main>
    )
}
