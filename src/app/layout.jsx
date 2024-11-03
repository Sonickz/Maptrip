import { Nunito } from 'next/font/google' 
import { WEB_NAME } from '@/config/config'
import Navbar from '@/components/layout/Navbar' 
import '@/styles/globals.css' 
import 'animate.css'

export const metadata = {
  title: WEB_NAME,
  description: `¡Bienvenido a ${WEB_NAME}!`,
} 

const nunito = Nunito({
  style: ["normal", "italic"],
  subsets: ["latin"]
})

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${nunito.className}`}>
        <Navbar />
        <main className="flex flex-col items-center overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  ) 
}
