import { NextResponse } from 'next/server'

export const petitionError = (error, message) => {
    return NextResponse.json({ error: `${message} ${error.message}` }, { status: 500 })
}