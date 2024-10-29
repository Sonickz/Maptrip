import Link from "next/link";
import Image from "next/image";
import MapSvg from '@/components/svg/map.svg';

export default function HomePage() {
  return (
    <article className="relative flex flex-row justify-end home">
      <section className="absolute left-4 w-[35%] hover:w-[39%] transition-full duration-300">
        <MapSvg className="w-full h-full map-svg"/>
      </section>
      <section className="flex flex-col items-center">
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
        <div className="flex flex-col items-center translate-y-[-15%] -rotate-2">
          <h1 className="home__title text-primary-700 text-[6.5vw] font-bold text-nowrap h-28">Viajando con Maptrip</h1>
          <p className="text-xl font-bold capitalize home__subtitle w-fit text-primary-700">¡CONOCE Y DISFRUTA DEL CAUCA DE FORMA INTERACTIVA!</p>
          <Link href="/map" className="px-6 py-3 my-6 text-xl transition-all duration-300 font-secondary btn hover:scale-110">Ver Mapa</Link>
        </div>
      </section>
    </article>
  );
}