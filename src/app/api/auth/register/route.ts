import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { zodValidateAPI } from '@/libs/libs'
import { NextApiRequest } from 'next'

export async function POST(req: NextApiRequest) {
    const { body: data } = req
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
        if (findUser.length > 0) return NextResponse.json({ message: 'Ya existe un usuario con estos datos' }, { status: 400 })

        //Hash password
        const userPassword = await bcrypt.hash(password, 10)

        //Create register
        const newUser = await prisma.users.create({
            data: { ...data, password: userPassword }
        })
        return NextResponse.json({ message: 'Cuenta creada satisfactoriamente', data: newUser })
    } catch (error: any) {
        return NextResponse.json({ error: 'Error al crear el usuario: ' + error.message }, { status: 500 })
    }
}

