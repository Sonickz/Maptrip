import FormComponent from '@/components/Form'
import { loginValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const LoginForm = ({ actualForm, switchForm }) => {
    const router = useRouter()
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

    const loginSubmit = async (values) => {
        const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false
        })
        setLoginAlerts(res)
        if (res.ok) {
            router.push('/')
            router.refresh()
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
            renderHeader={<p className="text-center text-primary-subtitle">Inicia sesion para acceder a todas las funcionalidades.</p>}
            renderChildren={(resetForm) => <p>No tienes una cuenta? <span className="form__leyend" onClick={() => { switchForm(resetForm); setLoginAlerts(null) }}>Registrate</span></p>}
        />
    )
}

export default LoginForm