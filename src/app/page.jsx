import Link from 'next/link'
import Image from 'next/image'
import { MapSvg, LogoMaptrip } from '@/components/svg/SvgComponents'
import { Divider } from 'primereact/divider'
import './home.css'

export default function HomePage() {
  return (
    <article className="relative flex flex-col justify-end !px-0 !py-0 main">
      {/* View 1 */}
      <article className="view view-1 flex flex-row justify-end overflow h-[90vh] !pr-0">
        {/* Map */}
        <section className="absolute left-4 w-[37%] hover:w-[40%] transition-full duration-300">
          <MapSvg className="w-full h-full map-svg" />
        </section>
        {/* Content */}
        <article className="relative">
          <section className="flex flex-col items-center">
            {/* Icons */}
            <ul className="flex flex-row items-center gap-10 -rotate-2">
              <li className="transition-all duration-200 cursor-pointer hover:scale-125">
                <Image src="/icons/bike.png" alt="Bike icon" width={100} height={100} />
              </li>
              <li className="transition-all duration-200 cursor-pointer hover:scale-125">
                <Image src="/icons/motorcycle.png" alt="Motorcycle icon" width={100} height={100} />
              </li>
              <li className="transition-all duration-200 cursor-pointer hover:scale-125">
                <Image src="/icons/golf_car.png" alt="Golf Car icon" width={100} height={100} />
              </li>
              <li className="transition-all duration-200 cursor-pointer hover:scale-125">
                <Image src="/icons/bus.png" alt="Bus icon" width={100} height={100} />
              </li>
              <li className="transition-all duration-200 cursor-pointer hover:scale-125">
                <Image src="/icons/car.png" alt="Car icon" width={100} height={100} />
              </li>
            </ul>
            {/* Text */}
            <div className="flex flex-col items-center translate-y-[-15%] -rotate-2">
              <h1 className="home__title text-primary-700 text-[6.5vw] font-bold text-nowrap h-28">Viajando con Maptrip</h1>
              <p className="text-xl font-bold capitalize home__subtitle w-fit text-primary-700">¡CONOCE Y DISFRUTA DEL CAUCA DE FORMA INTERACTIVA!</p>
              <Link href="/map" className="px-6 py-3 my-6 text-xl transition-all duration-300 font-secondary btn hover:scale-110">Ver Mapa</Link>
            </div>
          </section>
          {/* Side Text */}
          <section className="flex flex-col gap-2 absolute px-10 text-white bg-primary-500 rounded-full -right-[10vw] top-[48vh] py-10 circle">
            <h1 className="w-[70%] text-xl font-bold uppercase">Elige tu proximo destino con nosotros!</h1>
            <Link href="/" className="font-bold uppercase text-md">www.maptrip.com</Link>
          </section>
        </article>
      </article>
      <Divider layout="horizontal" />
      {/* View 2 */}
      <article className="view view-2 flex flex-col justify-center items-center text-[#16494b]">
        <header>
          <LogoMaptrip className="w-[12rem] h-[6rem]" />
        </header>
        <section className="flex flex-row justify-center items-center gap-24">
          <section>
            <Image src="/img/landscape.png" alt="Landscape Image" width={500} height={500}
              className="w-full h-full" />
          </section>
          <section className="w-[35%]">
            <h1 className="text-3xl font-extrabold uppercase">Destinos inolvidables, momentos historicos!</h1>
            <p className="text-xl font-semibold tracking-widest">Nos encargamos de todo para que tu solo tengas que disfrutar...</p>
          </section>
        </section>
      </article>
      <Divider layout="horizontal" />
      {/* View 3*/}
      <article className="view view-3 flex flex-row justify-center items-center gap-28 !py-16">
        <h1 className="text-5xl text-white font-extrabold text-center capitalize">¡Empieza <br /> a <br />interactuar!</h1>
        <Divider layout="vertical" className="before:!border-neutral-900 h-[60vh]" />
        <section className="w-[30%]">
          <MapSvg className="w-full h-full map-svg" />
        </section>
      </article>
    </article>
  )
}