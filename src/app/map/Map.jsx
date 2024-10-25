'use client'
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Loading from '@/app/loading';
import MapSvg from '@/components/svg/map.svg'
import CloseIcon from '@/components/svg/icons/close.svg';

export default function Map({ citysData }) {
    const [loading, setLoading] = useState(true);
    const mapRef = useRef(null);
    const [modal, setModal] = useState(false)
    const [citysList, setCitysList] = useState(citysData);
    const [hoverCity, setHoverCity] = useState(null)
    const [actualCity, setActualCity] = useState(citysData[0])
    const [hiddenCityBox, setHiddenCityBox] = useState(false)



    const resetMap = () => {
        const map = mapRef.current
        const mapPaths = map.querySelectorAll("path")
        mapPaths.forEach(path => {
            path.classList.remove("active")
        })
    }

    const closeModal = () => {
        setHiddenCityBox(false)
        setModal(false)
        resetMap()
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [])

    const [timer, setTimer] = useState(null)
    useEffect(() => {
        setHiddenCityBox(false)
        if (modal && !hoverCity) {
            if (timer) clearTimeout(timer)
            setTimer(setTimeout(() => {
                setHiddenCityBox(true)
            }, 5000))
        }
    }, [hoverCity])

    const isCity = (e) => {
        const cityCode = e.target.dataset.id
        return cityCode && !cityCode.includes('path') && cityCode.length === 5
    }

    const handleHover = (e) => {
        const cityCode = e.target.dataset.id
        if (isCity(e)) {
            const findCity = citysList.find(city => city.code === cityCode)
            setHoverCity(findCity)
        }
    }

    const handleClick = (e) => {
        if (isCity(e)) {
            resetMap()
            const citySelected = e.target
            citySelected.classList.add("active")

            setActualCity(hoverCity)
            setModal(true)
        }
    }

    return (
        // Map
        <article className={`flex flex-row items-center px-8 gap-20 overflow-hidden justify-center`}>
            {loading && (<Loading />)}
            <article className={`${loading ? 'hidden' : modal ? 'ml-0' : 'ml-[11%]'} flex lg:w-[35%] sm:w-[90%] 
            flex-col items-center justify-center gap-6 transition-all duration-700 ease-in-out`}>
                <h1 className={`w-[55%] px-2 py-3 text-xl text-center text-white rounded-md bg-primary-700 font-secondary
                    transition-all duration-500 ease-in-out ${hiddenCityBox ? 'opacity-0' : ''}`}>
                    {hoverCity ? hoverCity.name : modal && actualCity && !hoverCity ? actualCity.name : 'Elige un municipio'}
                </h1>
                <section className={`map w-full ${modal ? 'ml-0' : ''}`}
                    onMouseOver={(e) => handleHover(e)}
                    onMouseOut={() => setHoverCity(null)}
                    onClick={(e) => handleClick(e)}>
                    <MapSvg className="w-full h-full map-svg" ref={mapRef} />
                </section>
            </article>

            {/* Modal */}
            {loading || (<article className={`flex flex-col max-h-[70vh] overflow-hidden  
            bg-white rounded-lg border-2 border-primary-border transition-all duration-700 
            ease-in-out gap-12 map-modal ${modal ? 'translate-x-0 w-[50%] p-6' : 'translate-x-[100vw] w-0'}`}>
                <header className='flex flex-row items-center justify-between w-full h-fit'>
                    <Image src={`/img/flags/${actualCity.code}.jpg`} alt="Flag image" width={100} height={100}
                        className='w-24 border-2 border-primary' />
                    <h1 className='text-3xl me-10 text-primary-title font-secondary'>{actualCity.name}</h1>
                    <button className='w-10 text-lg transition-none text-primary-500 hover:text-primary-700' onClick={closeModal}>
                        <CloseIcon className="w-full h-full" />
                    </button>
                </header>
                <section className='flex flex-col gap-8 px-6 overflow-y-auto text-justify map-modal__content'>
                    <section className='flex flex-col items-center gap-2'>
                        <h1 className='text-lg font-bold text-primary-subtitle'>Descripción</h1>
                        <p>{actualCity.description}</p>
                    </section>
                    <section className='flex flex-col items-center gap-2'>
                        <h1 className='text-lg font-bold text-primary-subtitle'>Historia</h1>
                        <p>{actualCity.history}</p>
                    </section>
                </section>
            </article>
            )}
        </article >
    );
}