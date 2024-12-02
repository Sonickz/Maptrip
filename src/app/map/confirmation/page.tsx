import { cookies } from 'next/headers';
import { WEB_NAME } from '@/config/config'
import Confirmation from './Confirmation';
import { redirect } from 'next/navigation';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';
import { Payment } from 'mercadopago';
import { mercadopago } from '@/app/api/mercadopago/route';
import { cryp } from '@/libs/libs';
import { Citys, Products, Transports } from '@prisma/client';

export const metadata = {
    title: `Confirmación | ${WEB_NAME}`,
}

interface Props {
    searchParams: Record<string, string | undefined>
}

export default async function ConfirmationPage({ searchParams }: Props) {
    const { preference_id, status } = await searchParams
    let transactionData: { id: string | undefined, status: string | undefined } | undefined


    //* Auth
    const session = await auth()


    //* Cookies
    const cookiesStore = await cookies()

    //Payment Cookie
    const paymentCookie = cookiesStore.get('MAPTRIP-PAYMENT')?.value
    if (paymentCookie) {
        const paymentCookieData = cryp.decrypt<{ id: string, status: string }>(paymentCookie)

        // Comprobate transaction
        transactionData = { id: preference_id, status: preference_id && status === 'null' ? 'rejected' : status }
        const transactionPreferenceId = paymentCookieData?.id
        if (preference_id && !transactionPreferenceId) return redirect('/map')
        if (transactionPreferenceId) {
            const findTravel = await prisma.travels.findUnique({ where: { preferenceId: transactionPreferenceId } })
            transactionData = { id: transactionPreferenceId, status: findTravel ? 'approved' : 'rejected' }
        }
    }

    // Data Cookie
    interface DataCookie {
        city: Citys,
        transport?: Transports,
        products?: Products[],
        date?: string[]
    }
    const dataCookie = cookiesStore.get('MAPTRIP-DATA')?.value
    if (!dataCookie) return redirect('/map')
    const dataCookieData = cryp.decrypt<DataCookie>(dataCookie)


    //* Data    
    const cityData = dataCookieData.city
    const transportsData = await prisma.transports.findMany()
    const productsData = await prisma.products.findMany()

    // Prev data
    const selectedTransport = dataCookieData.transport ?? {}
    const selectedProducts = dataCookieData.products ?? []
    const selectedDate = dataCookieData.date ?? []

    const data = { cityData, transportsData, productsData, selectedSteppers: { selectedTransport, selectedProducts, selectedDate } }

    return (
        <Confirmation session={session} data={data} transaction={transactionData} />
    );
}