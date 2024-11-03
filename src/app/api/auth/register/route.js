import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { zodValidateAPI } from '@/libs/libs'

export async function POST(req, res) {
    const data = await req.json()
    const { username, email, password } = data

    try {
        //Validate data
        zodValidateAPI(registerValidationSchema, data)
        const findUser = await prisma.users.findMany({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        })
        if (findUser.length > 0) return NextResponse.json({ message: ['Ya existe un usuario con estos datos'] }, { status: 400 })

        //Hash password
        const userPassword = await bcrypt.hash(password, 10)

        //Create register
        const newUser = await prisma.users.create({
            data: { ...data, password: userPassword}
        })

        return NextResponse.json({
            message: 'Usuario creado satisfactoriamente',
            data: newUser
        })
    } catch (error) {
        return NextResponse.json({ message: ['Error al crear el usuario: ' + error.message] }, { status: 500 })
    }
}

