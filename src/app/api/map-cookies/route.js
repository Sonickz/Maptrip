import { NextResponse } from 'next/server'
import { petitionError } from '../config/libs'
import { cookies } from 'next/headers'
import { cryp } from '@/libs/libs'

export async function GET() {
    try {
        const cookieStore = await cookies()
        const cookie = cookieStore.get('MAPTRIP-DATA')?.value

        return NextResponse.json({ cookie }, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error to get map cookie')
    }
}

export async function POST(req) {
    const data = await req.json()

    try {
        const cookieStore = await cookies()
        const oldCookie = cookieStore.get('MAPTRIP-DATA')?.value
        const oldCookieData = cryp.decrypt(oldCookie)
        const encriptedData = cryp.encrypt({ ...oldCookieData, ...data })
        cookieStore.set('MAPTRIP-DATA', encriptedData, { httpOnly: true, secure: true })

        return NextResponse.json({ message: 'Map Cookie created' }, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error to create map cookie')
    }
}

export async function DELETE() {

    try {
        const cookieStore = await cookies()
        cookieStore.delete('MAPTRIP-DATA')
        cookieStore.delete('MAPTRIP-PAYMENT')

        return NextResponse.json({ message: 'Map Cookie deleted' }, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error to delete map cookie')
    }
}