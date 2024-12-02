import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { NextApiRequest } from 'next'

export async function GET() {

    try {
        const citys = await prisma.citys.findMany()
        return NextResponse.json(citys, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: 'Error getting citys' + error.message }, { status: 500 })
    }
}

export async function POST(req: NextApiRequest) {
    const { body: data } = req

    try {
        const newCitys = await prisma.citys.createMany({
            data: data
        })
        return NextResponse.json({ message: 'Citys created', data: newCitys }, { status: 200 })
    }
    catch (error: any) {
        return NextResponse.json({ error: 'Error creating citys' + error.message }, { status: 500 })
    }
}

