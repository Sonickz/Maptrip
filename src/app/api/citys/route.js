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
    const body = await req.json()

    try {
        if (!body.code) {
            const newCitys = await prisma.citys.createMany({
                data: body
            })
            return NextResponse.json({
                message: "Citys created",
                data: newCitys
            }, { status: 200 })
        }

        const { code, name, description, history } = body
        const newCity = await prisma.citys.create({
            data: {
                code,
                name,
                description,
                history
            }
        })

        return NextResponse.json({
            message: "City created",
            data: newCity
        }, { status: 200 })
    }
    catch (error) {
        return NextResponse.json({
            Error: "Error creating city" + error.message
        }, { status: 500 })
    }
}

