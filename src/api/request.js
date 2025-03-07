import axios from 'axios'

const service =  axios.create({
    baseURL: '/api',
    timeout: 120000,
})

export default service

