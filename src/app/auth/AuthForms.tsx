'use client'
import { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useRouter } from 'next/navigation'
import Loading from '../loading'
import { NextAuthSession } from '@/libs/auth'

interface Props {
    session: NextAuthSession
}

const AuthForms: React.FC<Props> = ({ session }) => {
    const router = useRouter()
    const [actualForm, setActualForm] = useState('login') // Login = 1 - Register = 2
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session) router.push('/')
        setLoading(false)
    }, [session])

    const switchForm = (resetForm: Function) => {
        setActualForm(actualForm === 'login' ? 'register' : 'login')
        if (resetForm) resetForm()
    }

    if (loading) return <Loading />
    return (
        <section className={`w-[90%] sm:w-[75%] md:w-[60%] lg:w-[45%] xl:w-[34%] card ${actualForm === 'login' ? 'max-h-[100vh]' : 'max-h-[195vh]'}`}>
            <LoginForm actualForm={actualForm} switchForm={switchForm} />
            <RegisterForm actualForm={actualForm} switchForm={switchForm} />
        </section >
    )
}

export default AuthForms