import { WEB_NAME } from '@/config/config'
import Travels from './Travels'
import { auth } from '@/libs/auth'
import prisma from '@/libs/prisma'
import { redirect } from 'next/navigation'

export const metadata = {
    title: ` Mis viajes | ${WEB_NAME}`
}

export default async function TravelsPage() {

    const session = await auth()
    if (!session) return redirect('/')
    const userId = session.user?.id

    const travelsData = await prisma.travels.findMany({
        where: {
            userId
        },
        include: {
            city: true,
            transport: true,
            ProductsOrders: true
        }
    })

    return (
        <Travels userTravels={travelsData} />
    );
}