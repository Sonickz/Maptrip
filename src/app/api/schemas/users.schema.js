import z from 'zod'

export const registerValidationSchema = z.object({
    names: z
        .string({ required_error: 'Este campo es obligatorio' })
        .min(4, { message: 'Los nombres deben tener al menos 4 caracteres' }),
    username: z
        .string({ required_error: 'Este campo es obligatorio' })
        .min(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' }),
    email: z
        .string({ required_error: 'Este campo es obligatorio' })
        .email({ message: 'Ingrese un correo electronico valido' }),
    password: z
        .string({ required_error: 'Este campo es obligatorio' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmPassword: z
        .string({ required_error: 'Las contraseñas no coinciden' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
})

export const loginValidationSchema = z.object({
    email: z
        .string({ required_error: 'Este campo es obligatorio' })
        .email({ message: 'Ingrese un correo electronico valido' }),
    password: z
        .string({ required_error: 'Este campo es obligatorio' })
})