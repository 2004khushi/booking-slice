import { assignProviderToBooking } from '@/lib/providerAssignment'
import { NextResponse } from 'next/server'

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params   // ✅ await params

        if (!id) {
            return NextResponse.json(
                { error: 'booking id missing in route' },
                { status: 400 }
            )
        }

        await assignProviderToBooking(id)

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('ASSIGN ERROR:', err)
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}
