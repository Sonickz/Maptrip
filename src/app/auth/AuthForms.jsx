'use client'
import { useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'


export default function AuthForms() {
    const [actualForm, setActualForm] = useState('login') // Login = 1 - Register = 2

    const switchForm = (resetForm) => {
        setActualForm(actualForm === 'login' ? 'register' : 'login')
        resetForm()
    }

    return (
        <section className={`w-[34%] card ${actualForm === 'login' ? 'max-h-[85vh]' : 'max-h-[195vh]'}`}>
            <LoginForm actualForm={actualForm} switchForm={switchForm} />
            <RegisterForm actualForm={actualForm} switchForm={switchForm} />
        </section >
    )
}