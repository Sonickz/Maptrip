'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect, useMemo } from 'react'
import { getMapDataCookie, payTravel, setMapDataCookie } from '@/app/api/config/routes'
import Loading from '@/app/loading'
import Cookies from 'js-cookie'
import Swal from 'sweetalert2'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { addLocale } from 'primereact/api'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { RadioButton } from 'primereact/radiobutton'
import { Divider } from 'primereact/divider'
import './confirmation.css'

export default function Confirmation({ session, data, transaction }) {
    const router = useRouter()

    const { id: userId, name: userName, email: userEmail } = session.user

    const { cityData, transportsData, productsData, selectedSteppers } = data
    const { id: cityId, code: cityCode, name: cityName, price: cityPrice } = cityData
    const { selectedTransport, selectedProducts, selectedDate } = selectedSteppers

    const [loading, setLoading] = useState(true)
    const [activeStep, setActiveStep] = useState(0)
    const stepperRef = useRef(null)
    const [stepperTransport, setStepperTransport] = useState(selectedTransport)
    const [stepperProducts, setStepperProducts] = useState(selectedProducts)
    const [stepperDate, setStepperDate] = useState([])

    // Loading effect
    useEffect(() => {
        if (transaction.status) {
            const transactionAlerts = {
                approved: () => Swal.fire({
                    icon: 'success',
                    title: '¡Tu viaje ha sido agendado!',
                    text: 'En unos momentos se comunicaran contigo para ultimar detalles, revista tu correo.',
                    timer: 6000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }),
                pending: () => Swal.fire({
                    icon: 'info',
                    title: '¡Tu viaje esta pendiente!',
                    text: 'Aun debes realizar el pago para confirmar tu viaje.',
                    showConfirmButton: false,
                }),
                rejected: () => Swal.fire({
                    icon: 'error',
                    title: '¡Tu pago ha sido rechazado!',
                    text: 'No se ha podido realizar el pago, intenta de nuevo.',
                    timer: 6000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }),
            }
            transactionAlerts[transaction.status]().then(() => {
                if (transaction.status === 'approved') {
                    router.refresh()
                    router.push('/map')
                }
                setStepperDate(selectedDate)
                setActiveStep(3)
                const loadingTimer = setTimeout(() => setLoading(false), 2000)
                return () => clearTimeout(loadingTimer)
            })
        } else {
            const loadingTimer = setTimeout(() => setLoading(false), 2000)
            return () => clearTimeout(loadingTimer)
        }
    }, [])

    const StepperPanelLayout = ({ children, title, titleIcon, buttons, isDisabled, hook }) => {

        const handleNextButton = () => {
            stepperRef.current.nextCallback()
            const { state, value } = hook
            state(value)
        }
        const BackButton = () => { return <Button label="Atras" icon="pi pi-arrow-left" iconPos="left" className="btn btn-secondary" onClick={() => stepperRef.current.prevCallback()} /> }
        const NextButton = () => { return <Button label="Siguiente" icon="pi pi-arrow-right" iconPos="right" className={`btn ${isDisabled ? 'btn-secondary' : ''}`} onClick={handleNextButton} disabled={isDisabled} /> }

        const isButtonBack = buttons.length === 1 && buttons[0] === 'back'
        const isButtonNext = buttons.length === 1 && buttons[0] === 'next'
        return (
            <article className="stepper-container">
                <header className="stepper-header">
                    <i className={`text-2xl ${titleIcon ?? ''}`}></i>
                    <h1 className="stepper-title">{title}</h1>
                </header>
                <section className="stepper-content">
                    {children}
                </section>
                <footer className={`stepper-buttons ${isButtonBack ? 'justify-start' : isButtonNext ? 'justify-end' : 'justify-between'}`}>
                    {isButtonBack && activeStep !== 3 && <BackButton />}
                    {isButtonNext && <NextButton />}
                    {buttons[0] === 'back' && buttons[1] === 'next' && (
                        <>
                            <BackButton />
                            <NextButton />
                        </>
                    )}
                </footer>
            </article>
        )
    }

    const TransportStepper = () => {
        const [selectedPersons, setSelectedPersons] = useState(stepperTransport.persons)
        const [selectedTransport, setSelectedTransport] = useState(stepperTransport.transport)

        const getTransportCapacity = (capacity) => capacity.split('-').map((digit) => parseInt(digit))

        const TransportOption = ({ name, capacity, isActive }) => {
            const [min, max] = getTransportCapacity(capacity)

            return (
                <li className={`transport-option ${isActive ? 'active' : ''}`}
                    title={!selectedPersons ? 'Selecciona la cantidad de personas primero' : name}>
                    <div className="w-[8rem]">
                        <Image src={`/img/transports/${name}.png`} alt="Transport image" width={500} height={500} className="w-full" />
                    </div>
                    <h1 className="text-lg font-bold">{name}</h1>
                    <p className="text-center">{min === 1 && max === 1 ? 'Unico pasajero' : `Minimo ${min} - Maximo ${max}`}</p>
                </li>
            )
        }

        //Dropdown options
        const dropdownOptions = useMemo(() => Array.from({ length: 10 }, (_, i) => ({
            label: `${i + 1} ${i + 1 === 1 ? 'persona' : 'personas'}`, value: i + 1
        })))

        const handleDropdownChange = (e) => {
            setSelectedPersons(e.value)
            const selectedPersons = e.value
            const selectedTransport = transportsData.find(({ capacity }) => {
                const [min, max] = getTransportCapacity(capacity)
                return selectedPersons >= min && selectedPersons <= max
            })
            setSelectedTransport(selectedTransport)
        }

        return (
            <StepperPanelLayout title="Selecciona la cantidad de personas y tu medio de transporte" titleIcon="pi pi-car" buttons={['next']} isDisabled={!selectedTransport} hook={{ state: setStepperTransport, value: { transport: selectedTransport, persons: selectedPersons } }}>
                <Dropdown className="border border-primary-500" placeholder="Selecciona la cantidad de personas"
                    value={selectedPersons}
                    options={dropdownOptions}
                    optionLabel='label'
                    optionValue='value'
                    onChange={(e) => handleDropdownChange(e)}
                />
                <ul className="transports-select flex flex-row gap-28 justify-between">
                    {transportsData.map(({ id, name, capacity }) => {
                        const [min, max] = getTransportCapacity(capacity)
                        const isActive = selectedPersons && selectedPersons >= min && selectedPersons <= max
                        return <TransportOption key={id} name={name} capacity={capacity} isActive={isActive} />
                    })}
                </ul>
            </StepperPanelLayout>
        )
    }

    const ProductsStepper = () => {
        const [selectedProducts, setSelectedProducts] = useState(stepperProducts)

        const handleDeleteProduct = (id) => {
            const findProduct = selectedProducts.find((item) => item.id === id)
            if (!findProduct) return;
            const newProducts = [...selectedProducts]
            newProducts.pop(findProduct)
            setSelectedProducts(newProducts)
        }

        const handleClickSizeProduct = (product) => {
            const { id } = product
            const findProduct = selectedProducts.find((item) => item.id === id)
            if (!findProduct) return setSelectedProducts([...selectedProducts, product])
            const newProducts = selectedProducts.map((item) => item.id === id ? product : item)
            setSelectedProducts(newProducts)
        }

        const productIsActive = (id) => {
            const findProduct = selectedProducts.find((item) => item.id === id)
            return findProduct
        }

        const productSizeIsActive = (id, size) => {
            const findProduct = selectedProducts.find((item) => item.id === id && item.size === size)
            return findProduct
        }

        const Product = ({ product }) => {
            const { id, name, sizes, price, img } = product
            const getSizesdata = (sizes) => sizes.split(',')
            const sizesData = getSizesdata(sizes)

            return (
                <li className={`product ${productIsActive(id) ? 'active' : ''}`} >
                    {productIsActive(id) && (
                        <section className="icons">
                            <div className="absolute -top-4 -left-4">
                                <i className="pi pi-check p-3 rounded-full bg-primary text-white text-lg" />
                            </div>
                            <div className="absolute top-2 right-2">
                                <Button className="w-2 h-10" icon="pi pi-trash" rounded onClick={() => handleDeleteProduct(id)} />
                            </div>
                        </section>
                    )}
                    <section className="flex flex-row items-center gap-8">
                        <section className="flex flex-col gap-4 items-center justify-center">
                            <div className="w-[8rem]">
                                <Image src={`/img/products/${img}`} alt={name} width={500} height={500} className="w-full" />
                            </div>
                            <h1 className="text-2xl">{name}</h1>
                        </section>
                        <section className="flex flex-col bg-primary py-2 rounded-xl">
                            {sizesData.length > 1
                                ? sizesData.map((size, i) => {
                                    const product = { id, name, size, price, img }
                                    return <Button key={i} label={size} className={`!px-4 !py-2 ${productSizeIsActive(id, size) ? '!bg-primary-active' : ''}`} onClick={() => handleClickSizeProduct(product)} />
                                })
                                : (
                                    <div className={`unique-size btn !rounded-sm ${productSizeIsActive(id, sizesData[0]) ? '!bg-primary-active' : ''}`} onClick={() => handleClickSizeProduct({ id, name, size: sizesData[0], price, img })}>{sizesData[0]}</div>
                                )}
                        </section>
                    </section>
                </li>
            )
        }

        return (
            <StepperPanelLayout title="Selecciona articulos del merch para compañar tu aventura" titleIcon="pi pi-shopping-bag" buttons={['back', 'next']} hook={{ state: setStepperProducts, value: selectedProducts }}>
                <ul className="flex flex-row items-center justify-center gap-16">
                    {productsData.map((product) => <Product key={product.id} product={product} />)}
                </ul>
            </StepperPanelLayout>
        )
    }

    const DateStepper = () => {
        const [selectedDate, setSelectedDate] = useState(stepperDate)

        addLocale('es', {
            firstDayOfWeek: 1,
            showMonthAfterYear: true,
            dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
            dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
            dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
            today: 'Hoy',
            clear: 'Limpiar'
        })

        const minDate = new Date()
        minDate.setDate(minDate.getDate() + 7)

        const maxDate = new Date()
        maxDate.setMonth(maxDate.getMonth() + 6)

        const handleCalendarChange = (e) => {
            const [dateStart, dateEnd] = e.value
            if (dateEnd !== null) {
                const date1 = new Date(dateStart)
                date1.setHours(12, 0, 0, 0)
                const date2 = new Date(dateEnd)
                date2.setHours(12, 0, 0, 0)

                const daysRange = Math.abs(date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)

                if (daysRange > 7) {
                    date2.setDate(date1.getDate() + 7)
                    Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000,
                        timerProgressBar: true,
                        customClass: {
                            container: '!w-[28rem]',
                            htmlContainer: '!my-0'
                        }
                    }).fire({
                        title: 'Rango de fecha excedido',
                        text: 'El rango de fecha seleccionado no puede ser mayor a 7 dias.',
                        icon: 'error'
                    })
                    return setSelectedDate([date1, date2])
                }
            }
            setSelectedDate(e.value)
        }

        return (
            <StepperPanelLayout title="Selecciona la fecha de ida y regreso" titleIcon="pi pi-calendar" buttons={['back', 'next']}
                hook={{ state: setStepperDate, value: selectedDate }}
                isDisabled={selectedDate.length < 1 || selectedDate.some(item => item === null)}
            >
                <Calendar value={selectedDate} onChange={(e) => handleCalendarChange(e)} locale="es" minDate={minDate} maxDate={maxDate} selectionMode="range" showIcon inline />
            </StepperPanelLayout>
        )
    }

    const FinalStepper = () => {
        const [payMethod, setPayMethod] = useState(null)
        const [confirmLoading, setConfirmLoading] = useState(false)

        //* Data
        const { transport: { id: transportId, name: transportName, price: transportPrice }, persons } = stepperTransport
        const [dateStart, dateEnd] = stepperDate.map((date) => new Date(date))
        const daysCant = Math.ceil(Math.abs(dateStart.getTime() - dateEnd.getTime()) / (1000 * 60 * 60 * 24))

        //* Calc total prices
        const totalTransport = transportPrice + ((cityPrice * daysCant) * persons)
        const totalProducts = stepperProducts ? stepperProducts.reduce((acc, { price }) => acc + price, 0) : 0
        const totalTravel = totalTransport + totalProducts

        //* Data to send
        const travelData = {
            userId,
            persons,
            dateStart,
            dateEnd,
            cityId,
            transportId,
            price: totalTravel
        }

        const productsOrdersData = stepperProducts.map(({ id: productId, size }) => {
            return {
                productId,
                travelId: null,
                size,
                quantity: 1
            }
        })

        const paymentData = {
            id: userId,
            userName,
            userEmail,
            title: `Viaje a ${cityName} en ${transportName}, ${persons} personas x ${daysCant} dias ${totalProducts > 0 ? `+ ${stepperProducts.length} productos` : ''}.`,
            img: `${cityCode}.jpg`,
            price: totalTravel
        }

        const userTravel = {
            travelData,
            productsOrdersData,
            paymentData
        }

        //* Functions & components 

        const tableProductImage = ({ img }) => {
            return <Image src={`/img/products/${img}`} alt="Product image" width={500} height={500} className="w-8" />
        }

        const tableProductPrice = ({ price }) => {
            return <span>$ {price.toLocaleString('es-CO')}</span>
        }

        const formatPrice = (price) => {
            return price.toLocaleString('es-CO')
        }

        const formatDate = (date) => {
            return date.toLocaleDateString('es-CO')
        }

        const PriceCard = ({ icon, text, price, className }) => {
            return (
                <div className="flex flex-row gap-2 items-center justify-center text-primary font-bold bg-primary-700 text-white px-5 py-3 rounded-2xl">
                    <i className={`pi ${icon ? icon : ''}`} />
                    <p className={`flex flex-row gap-2 items-center ${className ? className : ''}`}>{text}:
                        <span className="font-bold">${formatPrice(price)}</span>
                    </p>
                </div>
            )
        }

        const PayMethodRadio = ({ id, name, icon, img, value }) => {
            return (
                <div className="pay-method flex flex-row items-center gap-2 text-lg text-primary-700">
                    <RadioButton className="mr-2" inputId={`method${id}`} name="paymethods" value={value} onChange={(e) => setPayMethod(e.value)} checked={payMethod === value} />
                    {icon ?
                        <i className={`pi pi-building-columns ${icon}`} />
                        : <Image src={`/icons/${img}.png`} alt={`${name} icon`} className="w-[1.2rem]" width={200} height={200} />
                    }
                    <label htmlFor={`method${id}`} className="cursor-pointer">{name}</label>
                </div>
            )
        }

        const handleConfirm = async () => {
            setConfirmLoading(true)
            try {
                const mapDataCookie = await getMapDataCookie()
                if (mapDataCookie.status !== 200) return router.push('/map')
                await setMapDataCookie({ transport: stepperTransport, products: stepperProducts, date: stepperDate })
                const { data } = await payTravel(userTravel)
                router.push(data.init_point)
            } catch (error) {
                console.error(error)
            }
        }

        return (
            <StepperPanelLayout title="Confirma la información" buttons={['back']}>
                <article className="w-2/3 rounded-xl max-h-[90vh] overflow-y-auto">
                    {/* Resumen y Pago */}
                    <section className="flex flex-col gap-4 bg-primary text-white p-4 rounded-xl">
                        {/* Resumen */}
                        <section className="flex flex-col gap-10 rounded-xl bg-primary-400 py-8 px-6">
                            <header className="flex flex-row gap-4 items-center text-white text-4xl">
                                <i className="pi pi-car text-3xl" />
                                <h1 className="font-bold">Tu Viaje</h1>
                            </header>
                            {/* Contenedor */}
                            <div className="flex flex-col gap-10 px-4">
                                {/* Municipio */}
                                <section>
                                    <h2 className="title-resume">Municipio</h2>
                                    <section className="flex flex-col items-center justify-center gap-4">
                                        <div className="flex flex-row gap-4 items-center justify-center bg-primary-700 text-white rounded-xl px-4 py-2">
                                            <Image src={`/img/shields/${cityCode}.jpg`} alt="Shield image" width={500} height={500} className="w-7" />
                                            <p className="text-xl font-bold text-center">{cityName}</p>
                                            <Image src={`/img/flags/${cityCode}.jpg`} alt="Flag image" width={500} height={500} className="w-8" />
                                        </div>
                                        <div className="w-full h-[20rem]">
                                            <Image src={`/img/citys/${cityCode}.jpg`} alt="City image" width={1000} height={1000} className="w-full h-full rounded-3xl" />
                                        </div>
                                    </section>
                                </section>
                                <Divider layout="horizontal" />
                                {/* Estadia y Transporte */}
                                <section>
                                    <h2 className="title-resume">Estadia y Transporte</h2>
                                    <section className="flex flex-row justify-center gap-8">
                                        <div className="flex flex-row gap-2 items-center text-md bg-white text-primary rounded-3xl p-3 px-6">
                                            <i className="pi pi-user" />
                                            <p>Personas: <span className="text-primary-700 font-bold">{persons}</span></p>
                                        </div>
                                        <div className="flex flex-row gap-2 items-center text-md bg-white text-primary rounded-3xl p-3 px-6">
                                            <i className="pi pi-car" />
                                            <p>Vehiculo: <span className="text-primary-700 font-bold">{transportName}</span></p>
                                        </div>
                                    </section>
                                    <section className="flex flex-col gap-2 items-center justify-center mt-8">
                                        <PriceCard icon="pi-car" text="Costo transporte" price={transportPrice} />
                                        <PriceCard icon="pi-user" text="Costo dia por persona" price={cityPrice} />
                                        <PriceCard icon="pi-dollar" text="Total estadia y transporte" price={totalTransport} className="text-lg" />
                                    </section>
                                </section>
                                <Divider layout="horizontal" />
                                {/* Productos */}
                                {stepperProducts.length > 0 && (
                                    <>
                                        <section>
                                            <h2 className="title-resume">Productos</h2>
                                            <DataTable value={stepperProducts} size="normal">
                                                <Column field="name" header="Producto" />
                                                <Column header="Imagen" body={tableProductImage} />
                                                <Column field="size" header="Talla" />
                                                <Column field="price" header="$ Precio" body={tableProductPrice} />
                                            </DataTable>
                                            <section className="flex flex-row items-center justify-end mt-6 px-6">
                                                <PriceCard icon="pi-shopping-bag" text="Total productos" price={totalProducts} />
                                            </section>
                                        </section>
                                        <Divider layout="horizontal" />
                                    </>
                                )}
                                {/* Fecha */}
                                <section>
                                    <h2 className="title-resume">Fecha</h2>
                                    <section className="flex flex-row items-center justify-center gap-4">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-xl font-bold">Ida</span>
                                            <p className="text-lg bg-white py-2 px-6 text-primary rounded-3xl font-bold">{formatDate(dateStart)}</p>
                                        </div>
                                        <Divider layout="horizontal" className="!mt-8 !w-10" />
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <span className="text-xl font-bold">Regreso</span>
                                            <p className="text-lg bg-white py-2 px-6 text-primary rounded-3xl font-bold">{formatDate(dateEnd)}</p>
                                        </div>
                                    </section>
                                </section>
                                <Divider layout="horizontal" />
                                {/* Total */}
                                <section>
                                    <h2 className="title-resume">Todo tu viaje</h2>
                                    <section>
                                        <PriceCard icon="pi-dollar" text="TOTAL" price={`${formatPrice(totalTravel)} COP`} className="text-xl" />
                                    </section>
                                </section>
                            </div>
                        </section>
                        {/* Pago */}
                        <section className="flex flex-col gap-8 text-primary bg-white rounded-xl py-8 px-6">
                            <h1 className="title-resume !m-0">Metodos de pago</h1>
                            <section className="flex flex-col gap-4">
                                <PayMethodRadio id={1} name="Tarjeta de credito/debito" icon="pi-credit-card" value="card" />
                                <PayMethodRadio id={2} name="Transferencia bancaria" icon="pi-building-columns" value="bank-transfer" />
                                <PayMethodRadio id={3} name="Transferencia por PSE" img="pse-logo" value="pse" />
                                <PayMethodRadio id={4} name="Efectivo" icon="pi-money-bill" value="cash" />
                            </section>
                            <footer className="flex justify-end" title={!payMethod ? 'Selecciona un metodo de pago antes de continuar' : ''}>
                                <Button label={!confirmLoading ? 'Contratar viaje' : <Loading version={2} />} icon="pi pi-send" title="Contratar viaje"
                                    className={`w-fit ${!payMethod ? 'btn-secondary' : ''}`}
                                    onClick={handleConfirm}
                                    disabled={!payMethod} />
                            </footer>
                        </section>
                    </section>
                </article>
            </StepperPanelLayout>
        )
    }

    if (loading) return <Loading />

    return (
        <article className="main flex flex-col justify-center items-center gap-10">
            <header className="flex flex-row align-center justify-center">
                <h1 className="text-3xl text-primary font-bold">Confirmación</h1>
            </header>
            {/* Content */}
            <section className="flex flex-col justify-start items-center w-full px-24">
                <Stepper ref={stepperRef} linear headerPosition="bottom" className="w-full" activeStep={activeStep}>
                    {/* Stepper Personas y transporte */}
                    <StepperPanel header="Transporte">
                        <TransportStepper />
                    </StepperPanel>
                    {/* Stepper Productos */}
                    <StepperPanel header="Productos">
                        <ProductsStepper />
                    </StepperPanel>
                    {/* Stepper Fecha */}
                    <StepperPanel header="Fecha">
                        <DateStepper />
                    </StepperPanel>
                    {/* Stepper Final */}
                    <StepperPanel header="Confirmación">
                        <FinalStepper />
                    </StepperPanel>
                </Stepper>
            </section>
        </article >
    )
}