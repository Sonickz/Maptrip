import { Nunito } from "next/font/google";
import { WEB_NAME } from '@/config/config'
import Navbar from "@/components/layout/Navbar";
import "animate.css"
import "./globals.css";

export const metadata = {
  title: WEB_NAME,
  description: "¡Bienvenido a Maptrip!",
};

const nunito = Nunito({
  style: ["normal", "italic"],
  subsets: ["latin"]
})

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${nunito.className}`}>
      <Navbar />
      <main className="flex flex-col items-center py-16 px-14">
        {children}
      </main>
      </body>
    </html>
  );
}
