'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import UserIcon from '@/components/svg/icons/user.svg';
import 'animate.css';

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path) => {
        return pathname === path ? 'navbar__link--active' : '';
    }

    return (
        <nav className="navbar flex flex-row justify-between items-center py-6 px-16 pr-20 bg-primary text-white h-[64px]">
            <Link className="w-[10%] text-4xl navbar__title hover:font-bold animate__animated animate__rubberBand" href="/">
                Maptrip
            </Link>
            <ul className="flex flex-row justify-center w-1/2 gap-6 px-4 py-1 text-lg navbar__links">
                <li>
                    <Link href="/" className={`navbar__link hover:font-bold px-6 py-2 transition-all 
                    duration-100 ease-linear ${isActive('/')}`}>Home</Link>
                </li>
                <li>
                    <Link href="/map" className={`navbar__link hover:font-bold px-6 py-2 transition-all 
                    duration-100 ease-linear ${isActive('/map')}`}>Map</Link>
                </li>
            </ul>
            <div className='relative flex flex-row items-center text-white hover:text-primary-800'>
                <UserIcon className="z-10 w-10 h-10 cursor-pointer navbar__user" />
                <Link href="/login" className='absolute w-0 py-1 ml-2 transition-all duration-500 bg-white text-primary rounded-xl navbar__login'>Login</Link>
            </div>
        </nav>
    );
}