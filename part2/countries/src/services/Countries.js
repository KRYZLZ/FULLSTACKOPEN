import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getFind = (searchTerm) => {
    return getAll().then(countries =>
        countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
}

export default { getFind }
