import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
};

const useResource = (baseUrl, path) => {
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) {
      setResource(null);
      return;
    }

    const fetchResource = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${baseUrl}/${path}`);
        setResource({ found: true, data: response.data });
      } catch (error) {
        setResource({ found: false });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [baseUrl, path]);

  return { resource, loading, error };
};

const Country = ({ country }) => {
  if (!country) {
    return null;
  }

  if (!country.found) {
    return <div>not found...</div>;
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flags.png}
        height="100"
        alt={`flag of ${country.data.name.common}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const {
    resource: country,
    loading,
    error,
  } = useResource(
    "https://studies.cs.helsinki.fi/restcountries/api/name",
    name
  );

  const fetch = (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>
      {loading && <div>loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Country country={country} />
    </div>
  );
};

export default App;
