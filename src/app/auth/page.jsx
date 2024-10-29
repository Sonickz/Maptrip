import { WEB_NAME } from "@/config/config";
import AuthForms from "./AuthForms";

export const metadata = {
    title: `Iniciar Sesión | ${WEB_NAME}`
}

export default function AuthPage() {

    return (
        <article className="flex flex-col items-center justify-center gap-4">
            <AuthForms />
        </article>
    );
}