import { NextResponse } from 'next/server'

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