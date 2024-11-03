import prisma from '@/libs/prisma'
import { WEB_NAME } from '@/config/config' 
import Map from './Map'

export const metadata = {
    title: `Mapa | ${WEB_NAME}`
}

async function getCitys() {
    return await prisma.citys.findMany() 
}

export default async function MapPage() {
    const citysData = await getCitys() 
    
    return (
        <Map citysData={citysData} />
    ) 
}