import axios from 'axios'

const api = axios.create({
    baseURL: 'https://pensive-carroll-particularly.ngrok-free.dev'
})

export default api