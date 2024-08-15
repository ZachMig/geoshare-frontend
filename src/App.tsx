import axios from "axios";
import Account from "./components/Account.tsx";
import Login from "./components/Login.tsx";
import My from "./components/My.tsx";
import { Country, List, Location, Meta } from "./types.ts";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Manage from "./components/Manage.tsx";
import { useAuth } from "./hooks/useAuth.tsx";

//COMPONENT
function App() {
  const auth = useAuth();
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [metas, setMetas] = useState<Meta[] | null>(null);
  const [myLists, setMyLists] = useState<List[] | null>(null);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[] | null>(
    null
  );

  //Set Default Selected List
  const setDefaultList = () => {
    console.log("Running default list setter.");
    //Don't run if lists are not loaded yet
    if (!myLists) {
      console.log("no lists yet");
      return;
    }

    //If there is already a list selected, refresh that list by finding the
    // list in the refreshed myLists of the same id, and set that
    //If not found then that list was deleted, so find a new default list below
    if (selectedList) {
      console.log("already list");

      const refreshedList = myLists.find((list) => list.id === selectedList.id);

      if (refreshedList) {
        setSelectedList(refreshedList);
        setSelectedLocations(refreshedList.locations);
        return;
      }
    }

    //If no list selected yet, find one to default to
    //Or if the previously selected list was deleted

    //Find first list with any locations and set it as the default displayed
    const firstPopulatedList = myLists.find(
      (list) => list.locations.length > 0
    );
    console.log(firstPopulatedList + " first pop");
    //If we found a list with any number of locations > 0
    if (firstPopulatedList) {
      setSelectedList(firstPopulatedList);
      setSelectedLocations(firstPopulatedList.locations);
    } else {
      //No lists with locations found so set to empty array
      setSelectedList(myLists[0]);
      setSelectedLocations([]);
    }
  };

  //FETCH LISTS
  const fetchLists = async () => {
    console.log("Fetching fresh lists.");
    const config = {
      headers: {
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/api/lists/findformatted?uname=${auth?.user?.username}`,
        config
      );

      const fetchedLists: List[] = response.data;
      setMyLists(fetchedLists);
    } catch (error) {
      console.error("Error loading user lists: ", error);
    }
  };

  const onSelectList = (list: List) => {
    setSelectedList(list);
    setSelectedLocations(list.locations);
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

  //Whenever user changes wipe all data and reload
  useEffect(() => {
    console.log("USER CHANGING");
    setMyLists(null);
    setSelectedLocations(null);
    fetchLists();
  }, [auth.user]);

  useEffect(() => {
    setDefaultList();
  }, [myLists]);

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
              selectedLocations={selectedLocations}
              onSelectList={onSelectList}
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
