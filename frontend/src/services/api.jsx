import axios from 'axios'

export const api = axios.create({
    baseURL : "http://localhost:3000/api",
    withCredentials : true
    
})

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token')

//     if(token)
//     {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`
//     }
//     return config;
// })

export default api