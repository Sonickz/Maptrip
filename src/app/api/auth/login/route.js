import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { loginValidationSchema } from '@/app/api/schemas/users.schema'
import { zodValidateAPI } from '@/libs/libs'
import bcrypt from 'bcrypt'

export async function POST(req, res) {
    const data = await req.json()
    const { email, password } = data

    try {
        //Validate data
        zodValidateAPI(loginValidationSchema, data)
        const findUser = await prisma.users.findUnique({
            where: {
                email
            }
        })
        if (!findUser) return NextResponse.json({ message: ['No se ha encontrado ningun usuario'] }, { status: 404 })

        //Check password
        const passwordMatch = await bcrypt.compare(password, findUser.password)
        if (!passwordMatch) return NextResponse.json({ message: ['La contraseña es incorrecta'] }, { status: 400 })

        return NextResponse.json({
            message: 'Sesion creada exitosamente',
            data: findUser
        })
    } catch (error) {
        return NextResponse.json({ message: ['Error al iniciar sesion: ' + error.message] }, { status: 500 })
    }
}

