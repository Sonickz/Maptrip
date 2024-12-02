import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { ENCRIPT_KEY } from '@/config/config'
import { ZodSchema } from 'zod'

export const zodValidate = (schema: ZodSchema) => (values: Record<string, unknown>): {} | Record<string, string> => {
    const result = schema.safeParse(values)
    if (result.success) return {}
    const errors: Record<string, string> = {}
    result.error.issues.forEach(({ path, message }) => {
        errors[path[0]] = message
    })
    return errors
}

export function zodValidateAPI(schema: ZodSchema, data: Record<string, unknown>): {} | NextResponse {
    const result = schema.safeParse(data)
    if (result.success) return {}
    return NextResponse.json({ message: result.error.issues.map(({ message }) => message) }, { status: 400 })
}

export function zodValidateNextAuth(schema: ZodSchema, data: Record<string, unknown>): { success: boolean, errors?: string[] } {
    const result = schema.safeParse(data)
    if (!result.success) return { success: false, errors: result.error.issues.map(({ message }) => message) }
    return { success: true }
}

export const cryp = {
    key: ENCRIPT_KEY as string,

    encrypt: function (data: object): string {
        try {
            const dataString = JSON.stringify(data)
            const iv = crypto.randomBytes(16)
            if (!this.key) throw new Error('Encryption key is not defined')

            const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv)
            let encryptedData = cipher.update(dataString, 'utf8', 'base64')
            encryptedData += cipher.final('base64')
            return JSON.stringify({ data: encryptedData, ivHex: iv.toString('hex') })
        } catch (error) {
            console.error(error)
            throw new Error('Encryption failed')
        }
    },

    decrypt: function<T> (encryptedData: string): T {
        try {
            if (!encryptedData) throw new Error('Encrypted data is not defined')
            const { data, ivHex } = JSON.parse(encryptedData)
            if (!this.key) throw new Error('Encryption key is not defined')

            const iv = Buffer.from(ivHex, 'hex')
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv)
            let decryptedData = decipher.update(data, 'base64', 'utf8')
            decryptedData += decipher.final('utf8')

            return JSON.parse(decryptedData)
        } catch (error) {
            console.error(error)
            throw new Error('Decryption failed')
        }
    }
}