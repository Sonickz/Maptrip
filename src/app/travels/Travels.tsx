'use client'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'
import { Travels as TravelsType, Citys, Transports, ProductsOrders } from '@prisma/client'

interface TravelsModel extends TravelsType {
    city: Citys,
    transport: Transports,
    ProductsOrders: ProductsOrders[] | []
}

interface Props {
    userTravels: TravelsModel[] | []
}

const Travels: React.FC<Props> = ({ userTravels }) => {
    const router = useRouter()
    const formatUserTravels = userTravels.map((travel) => {

        return {
            ...travel,
            dateStart: new Date(travel.dateStart).toLocaleDateString('es-CO'),
            dateEnd: new Date(travel.dateEnd).toLocaleDateString('es-CO'),
            city: travel.city.name,
            transport: travel.transport.name,
            productsOrders: travel.ProductsOrders.length,
            paymentId: travel.paymentId.slice(0, 10),
            price: `$ ${travel.price.toLocaleString('es-CO')}`
        }
    })

    return (
        <article className="flex flex-col gap-12 items-center justify-center main">
            <h1 className="text-3xl text-primary-700 text-center font-bold">Mis viajes</h1>
            {userTravels.length ? (
                <section className="w-full">
                    <DataTable value={formatUserTravels}>
                        <Column field="id" header="#" />
                        <Column field="paymentId" header="Id Pago" />
                        <Column field="city" header="Municipio" />
                        <Column field="transport" header="Transporte" />
                        <Column field="persons" header="Personas" />
                        <Column field="dateStart" header="Fecha Inicio" />
                        <Column field="dateEnd" header="Fecha Fin" />
                        <Column field="productsOrders" header="Productos" />
                        <Column field="price" header="Precio" />
                    </DataTable>
                </section>
            ) : (
                <section className="flex flex-col items-center gap-4">
                    <h1 className="text-xl text-primary-800 font-bold">Aun no tienes viajes</h1>
                    <Button label="Crear viaje" icon="pi pi-map" tooltip="¡Empieza a planear tu viaje y disfruta de las mejores experiencias!"
                        onClick={() => router.push('/map')} />
                </section>
            )}
        </article>
    )
}

export default Travels
