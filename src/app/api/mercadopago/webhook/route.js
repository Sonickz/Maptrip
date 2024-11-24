import { NextResponse } from 'next/server'
import { petitionError } from '../../config/libs'
import prisma from '@/libs/prisma'
import { Payment } from 'mercadopago'
import { mercadopago } from '../route'

export async function POST(req) {
    const data = await req.json()
    const { data: { id } } = data

    try {
        const payment = await new Payment(mercadopago).get({ id })
        if (payment.status === 'approved') {

            const { travel_data: {
                user_id,
                persons,
                date_start,
                date_end,
                city_id,
                transport_id,
                price,
            },
                products_orders_data } = payment.metadata.data

            //* Save data

            const findTravel = await prisma.travels.findUnique({
                where: {
                    paymentId: id
                }
            })

            if (findTravel) return NextResponse.json(null, { status: 200 })
                
            //Save travel
            const newTravel = await prisma.travels.create({
                data: {
                    userId: user_id,
                    persons,
                    dateStart: date_start,
                    dateEnd: date_end,
                    cityId: city_id,
                    transportId: transport_id,
                    paymentId: id,
                    price
                }
            })

            //Save products
            const products = products_orders_data.map(({ product_id, size, quantity }) => {
                return {
                    productId: product_id,
                    travelId: newTravel.id,
                    size,
                    quantity
                }
            })

            await prisma.productsOrders.createMany({
                data: products
            })
        }
        return NextResponse.json(null, { status: 200 })
    } catch (error) {
        console.log(error)
        return petitionError(error, 'Creating preference error')
    }
}