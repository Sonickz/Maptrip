import FormComponent from '@/components/Form'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import { registerUser } from '@/app/api/config/routes'


const RegisterForm = ({ actualForm, switchForm }) => {
    const [registerAlerts, setRegisterAlerts] = useState(null)

    const registerFields = [
        {
            field: 'username',
            type: 'text',
            label: 'Nombre de usuario',
            value: 'Sonickz'
        },
        {
            field: 'gender',
            type: 'select',
            options: [{ label: 'Masculino', value: 'Masculino' }, { label: 'Femenino', value: 'Femenino' }],
            label: 'Genero',
            value: 'Masculino'
        },
        {
            field: 'age',
            type: 'number',
            label: 'Edad',
            onInput: (e) => {
                const value = e.target.value
                e.target.value = value.replace(/[^0-9]/g, '')
                if (value >= 122) e.target.value = 122
            },
            value: 19
        },
        {
            field: 'email',
            type: 'text',
            label: 'Correo electronico',
            value: 'ladigiococ@gmail.com'
        },
        {
            field: 'password',
            type: 'password',
            label: 'Contraseña',
            value: '12345678'
        },
        {
            field: 'confirmPassword',
            type: 'password',
            label: 'Confirmar contraseña',
            value: '12345678'
        }
    ]

    const registerSubmit = async (values, { resetForm }) => {
        const { confirmPassword, ...data } = values
        try {
            const res = await registerUser(data)
            setRegisterAlerts(res)
            resetForm()
        } catch (error) {
            setRegisterAlerts(error)
        }
    }

    return (
        <FormComponent
            title="Crear cuenta"
            fields={registerFields}
            schemaValidate={registerValidationSchema}
            onSubmit={registerSubmit}
            buttonText="Registrarse"
            alerts={registerAlerts}
            className={actualForm === 'register' ? 'w-full' : 'w-0 -translate-x-[100vw] text-nowrap'}
            renderChildren={(resetForm) => <p>Ya tienes una cuenta? <span className="form__leyend" onClick={() => switchForm(resetForm)}>Inicia sesion</span></p>}
        />
    )
}

export default RegisterForm