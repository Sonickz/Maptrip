import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { ENCRIPT_KEY, NEXTAUTH_SECRET } from '@/config/config'

export const zodValidate = (schema) => (values) => {
    const result = schema.safeParse(values)
    if (result.success) return
    const errors = {}
    result.error.issues.forEach(({ path, message }) => {
        errors[path[0]] = message
    })
    return errors
}

export function zodValidateAPI(schema, data, nextAuth) {
    const result = schema.safeParse(data)
    if (!result.success) return NextResponse.json({ message: result.error.issues.map(({ message }) => message) }, { status: 400 })
}

export function zodValidateNextAuth(schema, data) {
    const result = schema.safeParse(data)
    if (!result.success) return { success: false, errors: result.error.issues.map(({ message }) => message) }
    return { success: true }
}

export const cryp = {
    key: ENCRIPT_KEY,

    encrypt: function (data) {
        try {
            const dataString = JSON.stringify(data)
            const iv = crypto.randomBytes(16)

            const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv)
            let encryptedData = cipher.update(dataString, 'utf8', 'base64')
            encryptedData += cipher.final('base64')
            return JSON.stringify({ data: encryptedData, ivHex: iv.toString('hex') })
        } catch (error) {
            console.error(error)
        }
    },

    decrypt: function (encryptedData) {
        try {
            if (!encryptedData) return null
            const { data, ivHex } = JSON.parse(encryptedData)

            const iv = Buffer.from(ivHex, 'hex')
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv)
            let decryptedData = decipher.update(data, 'base64', 'utf8')
            decryptedData += decipher.final('utf8')

            return JSON.parse(decryptedData)
        } catch (error) {
            console.error(error)
        }
    }
}