import z from 'zod'

export const registerValidationSchema = z.object({
    username: z
        .string({ required_error: 'Este campo es obligatorio' })
        .min(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
        .max(20, { message: 'El nombre de usuario debe tener menos de 20 caracteres' }),
    gender: z
        .string()
        .min(1, { message: 'Este campo es obligatorio' }),
    age: z
        .number({ invalid_type_error: 'Este campo es obligatorio' })
        .min(1, { message: 'Este campo es obligatorio' })
        .refine((value) => value >= 18, { message: 'Debes ser mayor de edad' },
            (value) => value < 122, { message: 'La edad no es valida' }),
    email: z
        .string({ required_error: 'Este campo es obligatorio' })
        .email({ message: 'Ingrese un correo electronico valido' }),
    password: z
        .string({ required_error: 'Este campo es obligatorio' })
        .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
    confirmPassword: z
        .string()
        .min(1, { message: 'Las contraseñas no coinciden' })
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
})

export const loginValidationSchema = z.object({
    email: z
        .string({ required_error: 'Este campo es obligatorio' })
        .email({ message: 'Ingrese un correo electronico valido' }),
    password: z
        .string()
        .min(1, { message: 'Este campo es obligatorio' })
})