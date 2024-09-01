import axios from "axios";
import Account from "./components/Account.tsx";
import Login from "./components/Login.tsx";
import My from "./components/My.tsx";
import { Country, List, Location, Meta } from "./types.ts";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Manage from "./components/Manage.tsx";
import { useAuth } from "./hooks/useAuth.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Search from "./components/Search.tsx";
import About from "./components/About.tsx";
import UserGuide from "./components/UserGuide.tsx";

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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  //Set Default Selected List
  const setDefaults = () => {
    // console.log("Running default list setter.");
    //Don't run if lists are not loaded yet
    if (!myLists) {
      // console.log("no lists yet");
      return;
    }

    //If there is already a list selected, refresh that list by finding the
    // list in the refreshed myLists of the same id, and set that
    //If not found then that list was deleted, so find a new default list below
    if (selectedList) {
      const refreshedList = myLists.find((list) => list.id === selectedList.id);

      //Make sure this list hasn't been deleted since last check and actually has locations
      if (refreshedList && refreshedList.locations.length > 0) {
        setSelectedList(refreshedList);
        setSelectedLocations(refreshedList.locations);

        //Check if there is already a selected Location
        if (selectedLocation) {
          const refreshedLocation = refreshedList.locations.find(
            (location) => location.id === selectedLocation.id
          );

          //Check if the selected Location still exists and re-set it
          if (refreshedLocation) {
            setSelectedLocation(refreshedLocation);
          } else {
            setSelectedLocation(refreshedList.locations[0]);
          }
        }
        //Return if we found the selected list still existing, otherwise go to next logic
        return;
      }
    }

    //If no list selected yet, find one to default to
    //Or if the previously selected list was deleted

    //Find first list with any locations and set it as the default displayed
    const firstPopulatedList = myLists.find(
      (list) => list.locations.length > 0
    );
    //If we found a list with any number of locations > 0
    if (firstPopulatedList) {
      //Set the selected List
      setSelectedList(firstPopulatedList);

      //Set the selected Locations
      setSelectedLocations(firstPopulatedList.locations);

      //Set the selected Location
      if (firstPopulatedList.locations.length > 0) {
        setSelectedLocation(firstPopulatedList.locations[0]);
      } else {
        setSelectedLocation(null);
      }
    } else {
      //No lists with locations found so set to unlisted and empty array and null
      setSelectedList(myLists[0]);
      setSelectedLocations([]);
      setSelectedLocation(null);
    }
  };

  //FETCH LISTS
  const fetchLists = async () => {
    // console.log("Fetching fresh lists.");
    const config = {
      headers: {
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/api/lists/findformatted?uname=${auth.user.username}`,
        config
      );

      const fetchedLists: List[] = response.data;

      setMyLists(fetchedLists);
    } catch (error) {
      console.error("Error loading user lists: ", error);
    }
    setDefaults();
  };

  const onSelectList = (list: List | null) => {
    setSelectedList(list);

    //If set list is not null (i.e. not running a list delete command)
    if (list) {
      setSelectedLocations(list.locations);
      if (list.locations.length === 0) {
        setSelectedLocation(null);
      } else {
        setSelectedLocation(list.locations[0]);
      }
    } else {
      //probably being called off of a list delete command so find a new default list
      setDefaults();
    }
  };

  const onSelectLocation = (location: Location | null) => {
    // console.log("setting location: " + location?.description);
    setSelectedLocation(location);
  };

  const fetchCountriesAndMetas = async () => {
    const countryUrl = "https://api.geosave.org:8443/api/countries/findall";
    const metaUrl = "https://api.geosave.org:8443/api/metas/findall";

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
    // console.log("USER CHANGING");
    setMyLists(null);
    setSelectedLocations(null);
    setSelectedLocation(null);
    fetchLists();
  }, [auth.user]);

  useEffect(() => {
    setDefaults();
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
            <PrivateRoute
              Child={
                <My
                  countries={countries}
                  metas={metas}
                  myLists={myLists}
                  selectedList={selectedList}
                  selectedLocations={selectedLocations}
                  selectedLocation={selectedLocation}
                  onSelectList={onSelectList}
                  onSelectLocation={onSelectLocation}
                  fetchLists={fetchLists}
                />
              }
            />
          }
        />
        <Route
          path="/manage"
          element={
            <PrivateRoute
              Child={
                <Manage
                  countries={countries}
                  metas={metas}
                  myLists={myLists}
                  fetchLists={fetchLists}
                />
              }
            />
          }
        />
        <Route
          path="/search"
          element={<Search countries={countries} metas={metas} />}
        />
        <Route path="/account" element={<PrivateRoute Child={<Account />} />} />
        <Route path="/userguide" element={<UserGuide />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
