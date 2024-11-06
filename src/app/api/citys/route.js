import { NextResponse } from "next/server"
import prisma from "@/libs/prisma"

export async function GET() {

    try {
        const citys = await prisma.citys.findMany()
        return NextResponse.json(citys, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            Error: "Error getting citys" + error.message
        }, { status: 500 })
    }
}

export async function POST(req) {
    const data = await req.json()

    try {
        const newCitys = await prisma.citys.createMany({
            data: data
        })
        return NextResponse.json({
            message: "Citys created",
            data: newCitys
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({
            Error: "Error creating city" + error.message
        }, { status: 500 })
    }
}

