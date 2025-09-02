import { useState } from "react";
import FindCountry from "./FindCountry";

const Countries = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <FindCountry country={countries[0]} />;
  }

  if (selectedCountry) {
    return <FindCountry country={selectedCountry} />;
  }

  return (
    <ul>
      {countries.map(country => (
        <li key={country.cca3}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>Show</button>
        </li>

      ))}
    </ul>
  )
}

export default Countries