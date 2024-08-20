import { useEffect } from "react";
import { Country, List, Location, Meta } from "../types";
import MyLists from "./MyLists";
import MyLocations from "./MyLocations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";

interface MyProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  selectedList: List | null;
  selectedLocations: Location[] | null;
  selectedLocation: Location | null;
  onSelectList: (list: List | null) => void;
  onSelectLocation: (location: Location | null) => void;
  fetchLists: () => {};
}

//COMPONENT
const My = ({
  countries,
  metas,
  myLists,
  selectedList,
  selectedLocations,
  selectedLocation,
  onSelectList,
  onSelectLocation,
  fetchLists,
}: MyProps) => {
  useEffect(() => {
    //Load user lists if not done yet
    if (!myLists) {
      fetchLists();
    }
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
        <div className="col" style={{ maxWidth: "30vw" }}>
          {myLists && (
            <MyLists
              allLists={myLists}
              selectedList={selectedList}
              onSelectList={onSelectList}
              fetchLists={fetchLists}
            />
          )}
        </div>
        <div className="col" style={{ maxWidth: "30vw" }}>
          {selectedLocations && metas && countries && (
            <MyLocations
              locations={selectedLocations}
              selectedLocation={selectedLocation}
              metas={metas}
              countries={countries}
              onSelectLocation={onSelectLocation}
              fetchLists={fetchLists}
            />
          )}
        </div>
        <div className="col" style={{ maxWidth: "40vw" }}>
          {selectedLocation && <LocationPreview location={selectedLocation} />}
        </div>
      </div>
    </div>
  );
};

export default My;
