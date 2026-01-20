'use client'

import { useState } from 'react'

export default function AdminPage() {
    const [bookingId, setBookingId] = useState('')
    const [overrideStatus, setOverrideStatus] = useState('completed')
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [bookingStatus, setBookingStatus] = useState<string | null>(null)

    async function callApi(url: string, body?: any) {
        try {
            setLoading(true)
            setMessage(null)

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body ? JSON.stringify(body) : undefined,
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Something went wrong')

            setMessage('✅ Action completed successfully')

            // refresh status after action
            if (bookingId) fetchBookingStatus(bookingId)
        } catch (err: any) {
            setMessage(`❌ ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    async function fetchBookingStatus(id: string) {
        try {
            const res = await fetch(`/api/bookings/${id}`)
            const data = await res.json()
            setBookingStatus(data.status)
        } catch {
            setBookingStatus(null)
        }
    }

    const terminal =
        bookingStatus === 'completed' ||
        bookingStatus === 'cancelled' ||
        bookingStatus === 'no_show'

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <h1 style={styles.title}>Admin / Ops Panel</h1>
                    <p style={styles.subtitle}>
                        Manage booking lifecycle and provider assignments
                    </p>
                </header>

                {/* Booking ID Input */}
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Booking ID</label>
                    <input
                        value={bookingId}
                        onChange={(e) => {
                            const id = e.target.value
                            setBookingId(id)
                            if (id.length === 36) fetchBookingStatus(id)
                        }}
                        placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                        style={styles.input}
                    />
                </div>

                <div style={styles.divider} />

                {/* Actions */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>Primary Actions</h3>

                    <button
                        style={{ ...styles.button, ...styles.primaryBtn }}
                        disabled={!bookingId || loading || terminal}
                        onClick={() =>
                            callApi(`/api/admin/bookings/${bookingId}/assign`)
                        }
                    >
                        {loading ? 'Processing...' : 'Assign Provider'}
                    </button>

                    <div style={styles.statusBox}>
                        <label style={styles.label}>Override Status</label>
                        <div style={styles.row}>
                            <select
                                style={styles.select}
                                value={overrideStatus}
                                disabled={terminal}
                                onChange={(e) =>
                                    setOverrideStatus(e.target.value)
                                }
                            >
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="failed">Failed</option>
                            </select>
                            <button
                                style={{
                                    ...styles.button,
                                    ...styles.secondaryBtn,
                                }}
                                disabled={!bookingId || loading || terminal}
                                onClick={() =>
                                    callApi(
                                        `/api/admin/bookings/${bookingId}/override`,
                                        { status: overrideStatus }
                                    )
                                }
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div style={styles.dangerZone}>
                        <button
                            style={{
                                ...styles.button,
                                ...styles.outlineBtn,
                            }}
                            disabled={!bookingId || loading || terminal}
                            onClick={() =>
                                callApi(
                                    `/api/admin/bookings/${bookingId}/no-show`
                                )
                            }
                        >
                            Mark No-show
                        </button>

                        <button
                            style={{
                                ...styles.button,
                                ...styles.dangerBtn,
                            }}
                            disabled={!bookingId || loading || terminal}
                            onClick={() =>
                                callApi(
                                    `/api/admin/bookings/${bookingId}/cancel`
                                )
                            }
                        >
                            Cancel Booking
                        </button>
                    </div>
                </div>

                {message && (
                    <div
                        style={{
                            ...styles.message,
                            backgroundColor: message.includes('✅')
                                ? '#064e3b'
                                : '#450a0a',
                            borderColor: message.includes('✅')
                                ? '#10b981'
                                : '#f87171',
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}


const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '20px',
    },
    card: {
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#171717',
        border: '1px solid #262626',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    },
    header: { marginBottom: '24px' },
    title: { color: '#ffffff', fontSize: '20px', fontWeight: '600', margin: 0 },
    subtitle: { color: '#a3a3a3', fontSize: '14px', marginTop: '4px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#737373', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
    input: {
        width: '100%',
        backgroundColor: '#0a0a0a',
        border: '1px solid #404040',
        borderRadius: '6px',
        padding: '12px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    divider: { height: '1px', backgroundColor: '#262626', margin: '24px 0' },
    section: { display: 'flex', flexDirection: 'column', gap: '20px' },
    sectionTitle: { fontSize: '14px', color: '#e5e5e5', margin: 0 },
    row: { display: 'flex', gap: '10px' },
    statusBox: { display: 'flex', flexDirection: 'column' },
    select: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        border: '1px solid #404040',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    button: {
        padding: '10px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtn: { backgroundColor: '#3b82f6', color: '#fff' },
    secondaryBtn: { backgroundColor: '#404040', color: '#fff' },
    outlineBtn: { backgroundColor: 'transparent', border: '1px solid #404040', color: '#d4d4d4' },
    dangerBtn: { backgroundColor: '#7f1d1d', color: '#fecaca' },
    dangerZone: { marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    message: {
        marginTop: '24px',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '13px',
        borderWidth: '1px',
        borderStyle: 'solid',
        textAlign: 'center'
    }
}