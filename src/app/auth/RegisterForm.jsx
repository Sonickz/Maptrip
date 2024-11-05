import FormComponent from '@/components/Form'
import { registerUser } from '@/app/api/config/routes'
import { registerValidationSchema } from '@/app/api/schemas/users.schema'
import { useState } from 'react'
import Swal from 'sweetalert2'


const RegisterForm = ({ actualForm, switchForm }) => {
    const [registerAlerts, setRegisterAlerts] = useState(null)

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
            onInput: (e) => {
                const value = e.target.value
                e.target.value = value.replace(/[^0-9]/g, '')
                if (value >= 122) e.target.value = 122
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

    const registerSubmit = async (values, { resetForm }) => {
        const { confirmPassword, ...data } = values
        try {
            const res = await registerUser(data)
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
            }).then(() => {
                switchForm(resetForm)
            })
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