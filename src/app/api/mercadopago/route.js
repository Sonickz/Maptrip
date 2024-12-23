import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { petitionError } from '../config/libs'
import { WEB_URL } from '@/config/config'
import { cookies } from 'next/headers'
import { cryp } from '@/libs/libs'
import { v4 as uuidv4 } from 'uuid'

export const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })

export async function POST(req) {
    const data = await req.json()

    const uniqueId = uuidv4()
    const { travelData, productsOrdersData, paymentData: { userName, userEmail, title, img, price } } = data

    try {
        const preference = await new Preference(mercadopago).create({
            body: {
                items: [
                    {
                        id: uniqueId,
                        title,
                        description: 'Pago de viaje en Maptrip',
                        picture_url: `${WEB_URL}/img/citys/${img}`,
                        quantity: 1,
                        currency_id: 'COP',
                        unit_price: price,
                    }
                ],
                payer: {
                    name: 'Test User',
                    surname: userName,
                    email: userEmail,
                    identification: {
                        type: 'CC',
                        number: '1234567890'
                    },
                },
                metadata: {
                    id: uniqueId,
                    data: { travelData, productsOrdersData }
                },
                back_urls: {
                    success: `${WEB_URL}/map/confirmation`,
                    failure: `${WEB_URL}/map/confirmation`,
                    pending: `${WEB_URL}/map/confirmation`
                },
                auto_return: 'approved',
            }
        })

        const cookiesStore = await cookies()
        const newCookie = cryp.encrypt({ id: uniqueId, status: 'pending' })
        cookiesStore.set('MAPTRIP-PAYMENT', newCookie, { httpOnly: true, secure: true, maxAge: 60 * 15 })

        return NextResponse.json(preference, { status: 200 })
    } catch (error) {
        return petitionError(error, 'Creating preference error')
    }
}