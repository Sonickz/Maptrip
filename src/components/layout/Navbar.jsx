'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserIcon } from '@/components/svg/SvgComponents';
import { WEB_NAME } from '@/config/config';

const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path) => {
        return pathname === path;
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
    ];

    return (
        <nav className="navbar flex items-center py-6 px-16 pr-20 bg-primary text-white h-[64px]">
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
                                <Link href={route.route} className={`navbar__link hover:font-bold px-6 py-2 transition-all duration-100 ease-linear 
                                    ${isActive(route.route) && 'navbar__link--active'}`}>
                                    {route.name}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
                {/* Login Link */}
                <Link href="/auth" className={`navbar__user absolute right-0 flex flex-row items-center text-white 
                hover:text-primary-800 ${isActive('/auth') && 'navbar__user--active !text-primary-800'}`}>
                    <UserIcon className="z-10 w-10 h-10 cursor-pointer navbar__user-icon" />
                    <button className="absolute w-0 py-1 ml-2 transition-all duration-500 bg-white text-primary rounded-xl navbar__user-login">Login</button>
                </Link>
            </section>
        </nav>
    );
}

export default Navbar;