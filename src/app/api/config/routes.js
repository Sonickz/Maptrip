import axios from './axios'

export const getCitys = async () => axios.get('/citys')
export const loginUser = async (data) => axios.post('/auth/login', data)
export const registerUser = async (data) => axios.post('/auth/register', data)
