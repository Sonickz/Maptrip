import axios from './axios'

export const getCitys = async () => axios.get('/citys')
export const registerUser = async (data) => axios.post('/users', data)
