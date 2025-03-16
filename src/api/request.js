import axios from 'axios'

const service =  axios.create({
    baseURL: '/api',
    timeout: 240000,
})

export default service

