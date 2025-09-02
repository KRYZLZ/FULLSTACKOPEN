import { useEffect, useState } from "react"
import weatherService from "../services/Weather"

const getWeatherIcon = (weathercode) => {
    const weatherIcons = {
        0: '☀️', // Clear sky
        1: '🌤️', // Mainly clear
        2: '⛅', // Partly cloudy
        3: '☁️', // Overcast
        45: '🌫️', // Fog
        48: '🌫️', // Depositing rime fog
        51: '🌦️', // Light drizzle
        53: '🌦️', // Moderate drizzle
        55: '🌦️', // Dense drizzle
        61: '🌧️', // Slight rain
        63: '🌧️', // Moderate rain
        65: '🌧️', // Heavy rain
        80: '🌦️', // Slight rain showers
        81: '🌧️', // Moderate rain showers
        82: '⛈️', // Violent rain showers
        95: '⛈️', // Thunderstorm
        96: '⛈️', // Thunderstorm with slight hail
        99: '⛈️'  // Thunderstorm with heavy hail
    }
    return weatherIcons[weathercode] || '🌤️'
}

const FindCountry = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const [lat, lon] = country.latlng
        weatherService
            .getWeather(lat, lon)
            .then(weatherData => {
                setWeather(weatherData.current_weather)
            })
            .catch(error => {
                console.error('Error fetching weather:', error)
            })
    }, [country])

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} />
            {weather && (
                <div>
                    <h2>Weather in {country.capital}</h2>
                    <p>Temperature: {weather.temperature}°C</p>
                    <p style={{ fontSize: '5rem' }}>{getWeatherIcon(weather.weathercode)}</p>
                    <p>Wind: {weather.windspeed} m/s</p>
                </div>
            )}
        </div>
    )
}

export default FindCountry;