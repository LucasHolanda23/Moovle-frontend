import axios from 'axios'

const api = axios.create({
    baseURL: 'https://moovle2-do-lucas-2026.loca.lt',
    headers: {
        'bypass-tunnel-reminder': 'true'
    }
})

export default api