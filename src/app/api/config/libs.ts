import { NextResponse } from 'next/server'

export const petitionError = (error: any, message: string) => {
    return NextResponse.json({ error: `${message} ${error.message}` }, { status: 500 })
}