import FormComponent from '@/components/Form'
import { loginValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { FormAlertsProps } from '@/components/FormAlert'

interface Props {
    actualForm: string,
    switchForm: Function
}

const LoginForm: React.FC<Props> = ({ actualForm, switchForm }) => {
    const router = useRouter()
    const [loginAlerts, setLoginAlerts] = useState<FormAlertsProps>(null)

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

    const loginSubmit = async (values: Record<string, unknown>) => {
        const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false
        })
        if (res?.ok) {
            router.push('/')
            return router.refresh()
        }

        if (res?.error) setLoginAlerts({ error: res?.error, status: res.status })
    }

    return (
        <FormComponent
            className={actualForm === 'login' ? 'w-full' : 'w-0 -translate-x-[100vw] text-nowrap'}
            title="Iniciar sesión"
            fields={loginFields}
            schemaValidate={loginValidationSchema}
            onSubmit={loginSubmit}
            alerts={loginAlerts}
            renderHeader={<p className="text-center text-primary-subtitle">Inicia sesion para acceder a todas las funcionalidades.</p>}
            renderChildren={(resetForm) => <p>No tienes una cuenta? <span className="form__leyend" onClick={() => { switchForm(resetForm); setLoginAlerts(null) }}>Registrate</span></p>}
        />
    )
}

export default LoginForm