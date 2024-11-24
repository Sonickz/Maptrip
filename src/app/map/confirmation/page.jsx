import { cookies } from 'next/headers';
import { ENCRIPT_KEY, WEB_NAME } from '@/config/config'
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
    const { preference_id, payment_id, status } = await searchParams

    //* Cookies
    const cookiesStore = await cookies()

    const dataCookie = cookiesStore.get('MAPTRIP-DATA')?.value
    const dataCookieData = cryp.decrypt(dataCookie)

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
    if (payment_id && payment_id !== 'null') {
        const isSamePayment = paymentCookieData.id === preference_id
        const payment = await new Payment(mercadopago).get({ id: payment_id })
        if (payment && isSamePayment) transactionData = { id: preference_id, payment_id, data: payment?.metadata?.data, status: payment.status }
        else transactionData = { id: preference_id, status: 'rejected' }
    }

    return (
        <Confirmation session={session} data={data} transaction={transactionData} />
    );
}