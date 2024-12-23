import prisma from '@/libs/prisma'
import { NextResponse } from 'next/server'
import { petitionError } from '../config/libs'

export const GET = async () => {
    try {
        const products = await prisma.products.findMany()
        return NextResponse.json(products, { status: 200 })
    } catch (error) {
        petitionError(error, 'Error getting products')
    }
}

export const POST = async (req) => {
    const data = await req.json()
    try {
        const newProducts = await prisma.products.createMany({
            data: data
        })
        return NextResponse.json({ message: 'Products created', data: newProducts }, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Error creating products')
    }
}