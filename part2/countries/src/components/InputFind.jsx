import { useEffect, useState } from "react"
import countriesService from "../services/Countries"

export const InputFind = ({ setCountries }) => {
    const [searchTerm, setSearchTerm] = useState("")

    const handleChange = (event) => {
        setSearchTerm(event.target.value)
    }

    useEffect(() => {
        if (searchTerm) {
            const currentSearchTerm = searchTerm

            countriesService
                .getFind(searchTerm)
                .then(datafind => {
                    if (currentSearchTerm === searchTerm) {
                        const resultsArray = Array.isArray(datafind) ? datafind : [datafind];
                        setCountries(resultsArray)
                    }
                })
                .catch(() => {
                    if (currentSearchTerm === searchTerm) {
                        setCountries([])
                    }
                })
        } else {
            setCountries([])
        }
    }, [searchTerm, setCountries])

    return (
        <div>
            find countries <input value={searchTerm} onChange={handleChange} />
        </div>
    )
}
