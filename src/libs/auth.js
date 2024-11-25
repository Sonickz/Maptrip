import CredentialsProvider from 'next-auth/providers/credentials'
import { getServerSession } from 'next-auth'
import { zodValidateNextAuth } from '@/libs/libs'
import { loginValidationSchema } from '@/app/api/schemas/users.schema'
import prisma from '@/libs/prisma'
import bcrypt from 'bcrypt'

export const config = {
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const data = credentials
                const { email, password } = data

                //Validate data
                const validate = zodValidateNextAuth(loginValidationSchema, { email, password })
                if (!validate.success) throw new Error(validate.errors)

                //Find user
                const findUser = await prisma.users.findUnique({
                    where: {
                        email
                    }
                })
                if (!findUser) throw new Error('No se ha encontrado ningun usuario')

                //Check password
                const passwordMatch = await bcrypt.compare(password, findUser.password)
                if (!passwordMatch) throw new Error('La contraseña es incorrecta')

                return {
                    id: findUser.id,
                    name: findUser.username,
                    email: findUser.email
                }
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) return { ...token, ...user }
            return token
        },
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
        }
    },
    pages: {
        signIn: '/auth',
    }
}

export function auth(req, res) {
    return req && res ? getServerSession(req, res, config) : getServerSession(config)
}