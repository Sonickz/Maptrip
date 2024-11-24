import prisma from '@/libs/prisma'
import { WEB_NAME } from '@/config/config'
import Map from './Map'

export const metadata = {
    title: `Mapa | ${WEB_NAME}`
}

export default async function MapPage() {
    const citysData = await prisma.citys.findMany()

    return (
        <Map citysData={citysData} />
    )
}