import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'
import { petitionError } from '../config/libs'
import { NextApiRequest } from 'next'

export const GET = async () => {
    try {
        const transports = await prisma.transports.findMany()
        return NextResponse.json(transports, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error getting transports')
    }
}

export const POST = async (req: NextApiRequest) => {
    const { body: data } = req
    try {
        const newTransports = await prisma.transports.createMany({
            data: data
        })
        return NextResponse.json({ message: 'Transports created', data: newTransports }, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error creating transports')
    }
}