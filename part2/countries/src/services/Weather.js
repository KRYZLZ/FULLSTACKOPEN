import axios from 'axios'

const baseUrl = 'https://api.open-meteo.com/v1/forecast'

const getWeather = (lat, lon) => {
    const request = axios.get(`${baseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`)
    return request.then(response => response.data)
}

export default { getWeather }