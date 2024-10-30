'use client'
import { useState } from "react"
import { Formik, ErrorMessage, Field, Form } from "formik"
import { zodValidate } from '@/libs/libs'
import { registerUser } from '@/app/api/config/routes'
import { loginValidationSchema, registerValidationSchema } from '@/app/api/schemas/users.schema'
import { FormAlert } from '@/components/FormAlert'


export default function AuthForms() {
    const [loginForm, setLoginForm] = useState(true)
    const [registerAlerts, setRegisterAlerts] = useState(null)

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

    const registerFields = [
        {
            field: 'names',
            type: 'text',
            label: 'Nombres'
        },
        {
            field: 'username',
            type: 'text',
            label: 'Nombre de usuario'
        },
        {
            field: 'email',
            type: 'text',
            label: 'Correo electronico'
        },
        {
            field: 'password',
            type: 'password',
            label: 'Contraseña'
        },
        {
            field: 'confirmPassword',
            type: 'password',
            label: 'Confirmar contraseña'
        }
    ]

    const loginSubmit = (values, { resetForm }) => {
        alert(JSON.stringify(values))
        resetForm()
    }

    const registerSubmit = async (values, { resetForm }) => {
        try {
            const res = await registerUser(values)
            setRegisterAlerts({ status: res.status, data: res.data })
            resetForm()
        } catch (error) {
            setRegisterAlerts({ status: error.response.status, data: error.response.data.message })
        }
    }

    const switchForm = (resetForm) => {
        setLoginForm(!loginForm)
        resetForm()
    }

    return (
        <section className={`w-[34%] card ${loginForm ? 'max-h-[85vh]' : 'max-h-[130vh]'}`}>
            <Formik
                initialValues={loginFields.reduce((acc, field) => {
                    acc[field.field] = '';
                    return acc;
                }, {})}
                onSubmit={loginSubmit}
                validate={zodValidate(loginValidationSchema)}>
                {({ handleReset }) => (
                    <Form className={!loginForm ? 'w-0 -translate-x-[100vw] text-nowrap' : 'w-full'}>
                        <h1 className="form__title">Iniciar Sesión</h1>
                        <section className="form__inputs">
                            {loginFields.map((field, index) => {
                                return (
                                    <section key={index}>
                                        <div className="form__input-box">
                                            <Field name={field.field} type={field.type} placeholder="" />
                                            <label>{field.label}</label>
                                        </div>
                                        <ErrorMessage name={field.field} component="div" className="form__alert" />
                                    </section>
                                )
                            })}
                        </section>
                        <footer className="form__footer">
                            <button type="submit" className="form__submit">Iniciar Sesión</button>
                            <p>No tienes una cuenta?&nbsp;<span className="form__leyend" onClick={() => switchForm(handleReset)}>Registrate</span></p>
                        </footer>
                    </Form>
                )}
            </Formik>
            <Formik
                initialValues={registerFields.reduce((acc, field) => {
                    acc[field.field] = ''
                    return acc
                }, {})}
                onSubmit={registerSubmit}
                validate={zodValidate(registerValidationSchema)}>
                {({ handleReset }) => (
                    <Form className={loginForm ? 'w-0 -translate-x-[100vw] text-nowrap' : 'w-full'}>
                        <h1 className="form__title">Crear cuenta</h1>
                        <section className="form__inputs">
                            <FormAlert alert={registerAlerts} />
                            {registerFields.map((field, index) => {
                                return (
                                    <section key={index}>
                                        <div className="form__input-box">
                                            <Field name={field.field} type={field.type} placeholder="" />
                                            <label>{field.label}</label>
                                        </div>
                                        <ErrorMessage name={field.field} component="div" className="form__alert" />
                                    </section>
                                )
                            })}
                        </section>
                        <footer className="form__footer">
                            <button type="submit" className="form__submit">Registrarse</button>
                            <p>Ya tienes una cuenta?&nbsp;<span className="form__leyend" onClick={() => switchForm(handleReset)}>Inicia sesion</span></p>
                        </footer>
                    </Form>
                )}
            </Formik>
        </section >
    );
}