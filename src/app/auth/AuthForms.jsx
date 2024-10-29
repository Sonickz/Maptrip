'use client'
import { useState } from "react"
import { Formik, ErrorMessage, Field, Form } from "formik"
import { zodValidate } from '@/libs/libs'
import z from "zod"


export default function AuthForms() {
    const [loginForm, setLoginForm] = useState(true)

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

    const loginValidationSchema = z.object({
        email: z
            .string({ required_error: 'El correo electronico es requerido' })
            .email({ message: 'Ingrese un correo electronico valido' }),
        password: z
            .string({ required_error: 'La contraseña es requerida' })
            .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    })


    const registerFields = [
        {
            field: 'name',
            type: 'text',
            label: 'Nombre'
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

    const registerValidationSchema = z.object({
        name: z
            .string({ required_error: 'El nombre es requerido' })
            .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
        email: z
            .string({ required_error: 'El correo electronico es requerido' })
            .email({ message: 'Ingrese un correo electronico valido' }),
        password: z
            .string({ required_error: 'La contraseña es requerida' })
            .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
        confirmPassword: z
            .string({ required_error: 'La confirmacion de la contraseña es requerida' })
    }).refine(data => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"]
    })

    const loginSubmit = (values, { resetForm }) => {
        alert(JSON.stringify(values))
        resetForm()
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
                    acc[field.field] = '';
                    return acc;
                }, {})}
                onSubmit={loginSubmit}
                validate={zodValidate(registerValidationSchema)}>
                {({ handleReset }) => (
                    <Form className={loginForm ? 'w-0 -translate-x-[100vw] text-nowrap' : 'w-full'}>
                        <h1 className="form__title">Crear cuenta</h1>
                        <section className="form__inputs">
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