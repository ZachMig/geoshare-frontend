import axios from "axios";
import "./App.css";
import Account from "./components/Account.tsx";
import Login from "./components/Login.tsx";
import My from "./components/My.tsx";
import { Country, List, Meta } from "./types.ts";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Manage from "./components/Manage.tsx";

//COMPONENT
function App() {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [metas, setMetas] = useState<Meta[] | null>(null);
  const [myLists, setMyLists] = useState<List[] | null>(null);

  const fetchCountriesAndMetas = async () => {
    const countryUrl = "http://localhost:8080/api/countries/findall";
    const metaUrl = "http://localhost:8080/api/metas/findall";

    try {
      const [countriesResponse, metasResponse] = await Promise.all([
        axios.get(countryUrl),
        axios.get(metaUrl),
      ]);

      setCountries(countriesResponse.data);
      setMetas(metasResponse.data);
    } catch (error) {
      console.error("Error initializing countries/meta fetch. " + error);
    }
  };

  useEffect(() => {
    fetchCountriesAndMetas();
  }, []);

  if (!countries || !metas) {
    return <span>LOADING</span>;
  }

  //JSX
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/my"
          element={
            <My
              countries={countries}
              metas={metas}
              myLists={myLists}
              setMyLists={setMyLists}
            />
          }
        />
        <Route
          path="/manage"
          element={
            <Manage
              countries={countries}
              metas={metas}
              myLists={myLists}
              refreshData={fetchCountriesAndMetas}
            />
          }
        />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
