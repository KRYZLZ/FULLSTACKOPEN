import { useState } from "react"
import { InputFind } from "./components/InputFind"
import Countries from "./components/Countries"

const App = () => {
  const [countries, setCountries] = useState([])

  return (
    <>
      <InputFind setCountries={setCountries} />
      {countries.length > 0 && (
        <Countries countries={countries} />
      )}
    </>
  )
}

export default App
