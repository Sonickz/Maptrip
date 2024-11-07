'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { UserIcon } from '@/components/svg/SvgComponents'
import { WEB_NAME } from '@/config/config'
import { useRef } from 'react'
import { TieredMenu } from 'primereact/tieredmenu'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const Navbar = ({ session }) => {
    const pathname = usePathname()
    const userMenu = useRef(null)
    const router = useRouter()

    const isActive = (path) => {
        return pathname === path
    }

    const navbarRoutes = [
        {
            name: 'Inicio',
            route: '/'
        },
        {
            name: 'Mapa',
            route: '/map'
        }
    ]

    const menuOptions = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => { }
        },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
                signOut()
                router.push('/')
                router.refresh()
            }
        }
    ]

    return (
        <nav className="navbar flex items-center py-6 px-16 pr-10 bg-primary text-white h-[64px] fixed w-full z-20">
            <section className="relative flex flex-row items-center justify-center w-full">
                {/* Navbar Title */}
                <Link className="absolute left-0 text-4xl navbar__title hover:font-bold animate__animated animate__rubberBand" href="/">
                    {WEB_NAME}
                </Link>
                {/* Navbar Links */}
                <ul className="flex flex-row justify-center w-1/2 gap-6 px-4 py-1 text-lg navbar__links">
                    {navbarRoutes.map((route, i) => {
                        return (
                            <li key={i}>
                                <Link href={route.route} className={`navbar__link px-6 py-2 transition-all duration-100 ease-linear cursor-pointer rounded-md
                                    ${isActive(route.route) && 'navbar__link--active'}`}>
                                    {route.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                {/* User */}
                {!session && (
                    <Link href="/auth" className={`navbar__user ${isActive('/auth') && 'navbar__user--active'}`}>
                        <UserIcon className="navbar__user-icon" />
                        <span className="navbar__user-login">
                            Login
                        </span>
                    </Link>
                ) || (
                        <section className={`navbar__user ${session && ('navbar__user--active')}`}
                            title='Click para desplegar el menu'
                            onClick={(e) => userMenu.current.toggle(e)}
                        >
                            <UserIcon className="navbar__user-icon" />
                            <span className="navbar__user-login session">
                                {session.user.name}
                            </span>
                            <TieredMenu
                                className='!right-0'
                                model={menuOptions}
                                ref={userMenu}
                                popup
                            />
                        </section>
                    )}
            </section>
        </nav >
    )
}

export default Navbar 