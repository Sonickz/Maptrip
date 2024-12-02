import { Citys } from '@prisma/client'
import axios from './axios'



export const getCitys = async () => axios.get('/citys')
export const loginUser = async (data: { email: string, password: string }) => axios.post('/auth/login', data)
export const registerUser = async (data: {}) => axios.post('/auth/register', data)
export const payTravel = async (data: {}) => axios.post('/mercadopago', data)
export const getMapDataCookie = async () => axios.get('/map-cookies')
export const setMapDataCookie = async (data: { city: Citys }) => axios.post('/map-cookies', data)
export const cleanMapDataCookie = async () => axios.delete('/map-cookies')