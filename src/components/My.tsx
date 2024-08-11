import { useState, useEffect } from "react";
import { Country, List, Location, Meta } from "../types";
import axios from "axios";
import Lists from "./Lists";
import Locations from "./Locations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";

interface MyProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  setMyLists: React.Dispatch<React.SetStateAction<List[] | null>>;
}

//COMPONENT
const My = ({ countries, metas, myLists, setMyLists }: MyProps) => {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  //FETCH LISTS
  const getUserLL = async () => {
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

      //Find first list with any locations and set it as the default displayed
      const firstPopulatedList = fetchedLists.find(
        (list) => list.locations.length > 0
      );

      if (firstPopulatedList) {
        setSelectedList(firstPopulatedList);
      } else {
        //User has no lists or locations
        //TODO do something idk yet
      }
    } catch (error) {
      console.error("Error with initial List API call: ", error);
    }
  };

  //USEEFFECT STUB
  useEffect(() => {
    getUserLL();
  }, []);

  if (!myLists) {
    return <div>LOADING</div>;
  }

  //JSX
  return (
    <div className="container-fluid mt-5 h-100">
      <div className="row">
        <div className="col-md-3">
          {myLists && (
            <Lists myLists={myLists} onSelectList={setSelectedList} />
          )}
        </div>
        <div className="col-md-4">
          {selectedList && metas && countries && (
            <Locations
              list={selectedList}
              metas={metas}
              countries={countries}
              onSelectLocation={setSelectedLocation}
            />
          )}
        </div>
        <div className="col-md-5">
          {selectedLocation && <LocationPreview location={selectedLocation} />}
        </div>
      </div>
    </div>
  );
};

export default My;
