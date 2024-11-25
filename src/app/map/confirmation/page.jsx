import { cookies } from 'next/headers';
import { WEB_NAME } from '@/config/config'
import Confirmation from './Confirmation';
import { redirect } from 'next/navigation';
import { auth } from '@/libs/auth';
import prisma from '@/libs/prisma';
import { Payment } from 'mercadopago';
import { mercadopago } from '@/app/api/mercadopago/route';
import { cryp } from '@/libs/libs';

export const metadata = {
    title: `Confirmación | ${WEB_NAME}`,
}

export default async function ConfirmationPage({ searchParams }) {
    const { preference_id, status } = await searchParams

    //* Cookies
    const cookiesStore = await cookies()

    const dataCookie = cookiesStore.get('MAPTRIP-DATA')?.value
    const dataCookieData = cryp.decrypt(dataCookie)
    if (!dataCookie) return redirect('/map')

    const paymentCookie = cookiesStore.get('MAPTRIP-PAYMENT')?.value
    const paymentCookieData = cryp.decrypt(paymentCookie)


    //* Auth
    const session = await auth()

    //* Data
    let transactionData
    const cityData = dataCookieData.city
    const transportsData = await prisma.transports.findMany()
    const productsData = await prisma.products.findMany()

    //* Prev data
    const selectedTransport = dataCookieData.transport ?? {}
    const selectedProducts = dataCookieData.products ?? []
    const selectedDate = dataCookieData.date ?? []

    const data = { cityData, transportsData, productsData, selectedSteppers: { selectedTransport, selectedProducts, selectedDate } }

    //* Comprobate transaction
    transactionData = { id: preference_id, status: preference_id && status === 'null' ? 'rejected' : status }
    const transactionPreferenceId = paymentCookieData?.id
    if (preference_id && !transactionPreferenceId) return redirect('/map')
    if (transactionPreferenceId) {
        const findTravel = await prisma.travels.findUnique({ where: { preferenceId: transactionPreferenceId } })
        if (findTravel) transactionData = { id: transactionPreferenceId, status: 'approved' }
    }

    return (
        <Confirmation session={session} data={data} transaction={transactionData} />
    );
}