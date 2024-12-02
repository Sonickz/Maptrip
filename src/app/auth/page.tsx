import { WEB_NAME } from '@/config/config'
import AuthForms from './AuthForms'
import { auth } from '@/libs/auth'

export const metadata = {
    title: `Iniciar Sesión | ${WEB_NAME}`
}

export default async function AuthPage() {
    const session = await auth()
    
    return (
        <article className="flex flex-col items-center justify-center gap-4 main">
            <AuthForms session={session} />
        </article>
    )
}