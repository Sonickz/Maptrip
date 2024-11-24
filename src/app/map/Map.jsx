'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { MapSvg, CloseIcon, DownArrowIcon } from '@/components/svg/SvgComponents'
import Loading from '@/app/loading'
import Cookies from 'js-cookie'
import { cleanMapDataCookies, setMapDataCookie } from '../api/config/routes'

export default function Map({ citysData }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [hoverCity, setHoverCity] = useState(null)
    const [actualCity, setActualCity] = useState(citysData[0])
    const [hiddenCityBox, setHiddenCityBox] = useState(false)
    const [modal, setModal] = useState(false)
    const [modalTransition, setModalTransition] = useState(false)
    const mapRef = useRef(null)
    const modalContentRef = useRef(null)


    //* Effects

    //Loading
    useEffect(() => {
        const cleanCookies = async () => {
            await cleanMapDataCookies()
        }
        cleanCookies()
        const loadingTimer = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(loadingTimer)
    }, [])

    //Hide city box
    const timerRef = useRef(null)
    useEffect(() => {
        setHiddenCityBox(false)
        if (modal && !hoverCity) {
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => setHiddenCityBox(true), 10000)
        }
        return () => clearTimeout(timerRef.current)
    }, [hoverCity, modal])


    //* Functions

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

    //Comprobate if the element is a city
    const isCity = (e) => {
        const cityCode = e.target.dataset.id
        return cityCode && !cityCode.includes("path") && cityCode.length === 5
    }


    //* Handlers

    const handleHover = (e) => {
        const cityCode = e.target.dataset.id
        if (isCity(e)) {
            const findCity = citysData.find(city => city.code === cityCode)
            setHoverCity(findCity)
        }
    }

    const handleClick = (e) => {
        if (isCity(e)) {
            setModalTransition(true)
            resetMap()
            const citySelected = e.target
            citySelected.classList.add("active")
            setTimeout(() => {
                modalContentRef.current ? modalContentRef.current.scrollTop = 0 : null
                setActualCity(hoverCity)
                setModal(true)
            }, 400)
            const time = modal ? 750 : 0
            setTimeout(() => {
                setModalTransition(false)
            }, time)
        }
    }

    const handleScroll = () => {
        const modalContent = modalContentRef.current
        if (modalContent) {
            const arrow = modalContent.querySelector(".arrow")
            modalContent.scrollTop >= 230 && arrow.classList.add("animate__fadeOutDown")
            modalContent.scrollTop <= 30 && arrow.classList.remove("animate__fadeOutDown")
        }
    }

    //Continue
    const handleContinue = async () => {
        setConfirmLoading(true)
        try {
            const res = await setMapDataCookie({ city: actualCity })
            if (res.status === 200) router.push('/map/confirmation')
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <Loading />
    return (
        <article className="flex flex-row items-center justify-center gap-20 overflow-hidden main" >
            {/* Map */}
            <article className={`${modal ? 'ml-0 lg:w-[80%]' : 'ml-[10%] lg:w-[45%]'} flex sm:w-[90%] 
            flex-col items-center justify-center gap-6 transition-all duration-1000 ease-in-out`}>
                <h1 className={`w-[50%] h-14 flex items-center justify-center text-xl text-white rounded-md bg-primary-700 font-secondary
                    transition-all duration-1000 ease-in-out animate__animated ${hiddenCityBox && 'animate__fadeOut !h-0'}`}>
                    {hoverCity ? hoverCity.name : modal && actualCity && !hoverCity ? actualCity.name : 'Elige un municipio'}
                </h1>
                <section className="w-full map"
                    onMouseOver={(e) => handleHover(e)}
                    onMouseOut={() => setHoverCity(null)}
                    onClick={(e) => handleClick(e)}>
                    <MapSvg className="w-full h-full map-svg" ref={mapRef} />
                </section>
            </article>

            {/* Modal */}
            <article className={`flex flex-col max-h-[95vh] overflow-hidden  
            bg-white rounded-lg border-2 border-primary-border transition-all duration-500 
            ease-in-out gap-8 map-modal ${modal ? 'translate-x-0 w-full px-10 pt-20 pb-6' : 'translate-x-[100vw] w-0'}
            ${modalTransition && 'opacity-0'}`}>
                {/* Header */}
                <button className="absolute w-10 text-lg transition-none -right-1 -top-1 text-primary-500 hover:text-primary-700" onClick={closeModal} title="Cerrar modal">
                    <CloseIcon className="w-full h-full" />
                </button>
                <header className="relative flex flex-row items-center justify-center w-full h-fit pb-6">
                    <Image src={`/img/flags/${actualCity.code}.jpg`} alt="Flag image" title={`Bandera de ${actualCity.name}`} width={1000} height={1000}
                        className="absolute left-0 w-[5.8rem] border-2 border-primary" />
                    <h1 className="text-3xl text-primary-title font-secondary">{actualCity.name}</h1>
                    <Image src={`/img/shields/${actualCity.code}.jpg`} alt="Shield image" title={`Escudo de ${actualCity.name}`} width={1000} height={1000}
                        className="absolute right-0 w-[5rem]" />
                </header>
                {/* Content */}
                <section className="flex flex-col items-center gap-4 px-6 overflow-y-auto text-justify scrollbar" ref={modalContentRef} onScroll={handleScroll}>
                    {/* Imagen */}
                    <section className="flex flex-col items-center w-full">
                        <Image src={`/img/citys/${actualCity.code}.jpg`} alt="City image" title={`Municipio de ${actualCity.name}`} width={2000} height={2000}
                            className="w-full rounded-3xl max-h-[16rem]" />
                        <div title="¡Desplazate hacia abajo!">
                            <DownArrowIcon className="z-10 h-12 w-12 text-primary-700 arrow animate__animated" />
                        </div>
                    </section>
                    {/* Text */}
                    <section className="flex flex-col items-center gap-2">
                        <h1 className="text-lg font-bold text-primary-subtitle">Descripción</h1>
                        <p>{actualCity.description}</p>
                    </section>
                    <section className="flex flex-col items-center gap-2">
                        <h1 className="text-lg font-bold text-primary-subtitle">Historia</h1>
                        <p>{actualCity.history}</p>
                    </section>
                </section>
                {/* Footer */}
                <footer className='sticky bottom-0 flex flex-row align-center justify-end'>
                    <button type="button" className="btn" onClick={handleContinue}>{confirmLoading ? <Loading version={2} /> : 'Continuar'}</button>
                </footer>
            </article>
        </article>
    )
}