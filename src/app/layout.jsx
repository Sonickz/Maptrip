import { auth } from '@/libs/auth'
import { Nunito } from 'next/font/google'
import { WEB_NAME } from '@/config/config'
import Navbar from '@/components/layout/Navbar'
import '@/styles/globals.css'
import 'animate.css'
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-blue/theme.css'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: WEB_NAME,
  description: `¡Bienvenido a ${WEB_NAME}!`,
}

const nunito = Nunito({
  style: ["normal", "italic"],
  subsets: ["latin"]
})

export default async function RootLayout({ children }) {
  const session = await auth()

  return (
    <html lang="es">
      <body className={`${nunito.className}`}>
        <Navbar session={session} />
        <main className="flex flex-col items-center overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  )
}
