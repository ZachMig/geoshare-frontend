import { useState, useEffect } from "react";
import { Country, List, Location, Meta } from "../types";
import Lists from "./Lists";
import Locations from "./Locations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";

interface MyProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  fetchLists: () => {};
}

//COMPONENT
const My = ({ countries, metas, myLists, fetchLists }: MyProps) => {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  //Set Default Selected List
  const setDefaultList = () => {
    console.log("Running default list setter.");
    //Don't run if lists are not loaded yet
    if (!myLists) return;

    //Don't run if there is already a selected list
    if (selectedList) {
      //Force deep refresh of this state
      const newList: List = selectedList;
      setSelectedList(newList);
    }

    //Find first list with any locations and set it as the default displayed
    const firstPopulatedList = myLists.find(
      (list) => list.locations.length > 0
    );

    if (firstPopulatedList) {
      //Force deep refresh of this state
      const newList: List = firstPopulatedList;
      setSelectedList(newList);
    } else {
      //User has no lists or locations
      //TODO do something idk yet
      //setNoLists(true);
    }
  };

  //USEEFFECT STUB
  useEffect(() => {
    //Load user lists if not done yet
    if (!myLists) {
      fetchLists();
    }
    setDefaultList();
  }, [myLists]);

  //Placeholder if lists are not loaded
  if (!myLists) {
    return <div>LOADING</div>;
  }

  //JSX
  return (
    //Setup routing to <Manage> or other in case of user has no lists yet
    // {if (noLists) {
    //   return
    // }

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
              locations={selectedList.locations}
              metas={metas}
              countries={countries}
              onSelectLocation={setSelectedLocation}
              fetchLists={fetchLists}
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
