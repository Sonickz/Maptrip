import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';
import bcrypt from 'bcrypt'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { zodValidateAPI } from '@/libs/libs'

export function GET() {

    return NextResponse.json("Get Users")
}

export async function POST(req, res) {
    const data = await req.json()
    const { names, username, email, password, confirmPassword } = data

    try {
        zodValidateAPI(registerValidationSchema, data)
        const findUser = await prisma.users.findMany({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        })
        if (findUser.length > 0) return NextResponse.json({ message: ["Ya existe un usuario con estos datos"] }, { status: 400 })
        const userPassword = await bcrypt.hash(password, 10)
        const newUser = await prisma.users.create({
            data: {
                names,
                username,
                email,
                password: userPassword
            }
        })

        return NextResponse.json({
            message: "Usuario creado satisfactoriamente",
            data: newUser
        })
    } catch (error) {
        return NextResponse.json({
            Error: "Error al crear el usuario: " + error.message
        }, { status: 500 })
    }
}

