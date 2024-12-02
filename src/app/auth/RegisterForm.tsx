import FormComponent from '@/components/Form'
import { registerUser } from '@/app/api/config/routes'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import Swal from 'sweetalert2'
import { FormAlertsProps } from '@/components/FormAlert'

interface Props {
    actualForm: string,
    switchForm: Function
}

const RegisterForm: React.FC<Props> = ({ actualForm, switchForm }) => {
    const [registerAlerts, setRegisterAlerts] = useState<FormAlertsProps>(null)

    const registerFields = [
        {
            field: 'username',
            type: 'text',
            label: 'Nombre de usuario',
        },
        {
            field: 'gender',
            type: 'select',
            options: [{ label: 'Masculino', value: 'Masculino' }, { label: 'Femenino', value: 'Femenino' }],
            label: 'Genero',
        },
        {
            field: 'age',
            type: 'number',
            label: 'Edad',
            onInput: (e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                e.target.value = value.replace(/[^0-9]/g, '')
                if (parseInt(value) >= 122) e.target.value = "122"
            },
        },
        {
            field: 'email',
            type: 'text',
            label: 'Correo electronico',
        },
        {
            field: 'password',
            type: 'password',
            label: 'Contraseña',
        },
        {
            field: 'confirmPassword',
            type: 'password',
            label: 'Confirmar contraseña',
        }
    ]

    const registerSubmit = async (values: Record<string, unknown>, { resetForm }: { resetForm: Function }) => {
        const { confirmPassword, ...data } = values
        try {
            const res = await registerUser(data)
            switchForm(resetForm)
            Swal.mixin({
                toast: true,
                position: 'top-end',
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false
            }).fire({
                icon: 'success',
                title: res.data.message,
                text: 'Ya puedes iniciar sesion',
                customClass: {
                    container: '!w-[28vw]',
                    title: '!mb-0'
                }
            })
        } catch (error: any) {
            setRegisterAlerts({ error: error.message, status: 400 })
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