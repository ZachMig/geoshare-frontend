import axios from "axios";
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

  //FETCH LISTS
  const fetchLists = async () => {
    console.log("Fetching fresh lists.");
    const username = localStorage.getItem("username");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/api/lists/findformatted?uname=${username}`,
        config
      );

      const fetchedLists: List[] = response.data;
      setMyLists(fetchedLists);
    } catch (error) {
      console.error("Error loading user lists: ", error);
    }
  };

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
              fetchLists={fetchLists}
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
              fetchLists={fetchLists}
            />
          }
        />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
