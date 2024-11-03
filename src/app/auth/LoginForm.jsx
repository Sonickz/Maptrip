import FormComponent from '@/components/Form'
import { loginValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import { loginUser } from '@/app/api/config/routes'

const LoginForm = ({ actualForm, switchForm }) => {
    const [loginAlerts, setLoginAlerts] = useState(null)

    const loginFields = [
        {
            field: 'email',
            type: 'text',
            label: 'Correo electronico'
        },
        {
            field: 'password',
            type: 'password',
            label: 'Contraseña'
        }
    ]

    const loginSubmit = async (values, { resetForm }) => {
        try {
            const res = await loginUser(values)
            setLoginAlerts(res)
        } catch (error) {
            setLoginAlerts(error)
        }
    }

    return (
        <FormComponent
            className={actualForm === 'login' ? 'w-full' : 'w-0 -translate-x-[100vw] text-nowrap'}
            title="Iniciar sesión"
            fields={loginFields}
            schemaValidate={loginValidationSchema}
            onSubmit={loginSubmit}
            alerts={loginAlerts}
            renderChildren={(resetForm) => <p>No tienes una cuenta? <span className="form__leyend" onClick={() => switchForm(resetForm)}>Registrate</span></p>}
        />
    )
}

export default LoginForm