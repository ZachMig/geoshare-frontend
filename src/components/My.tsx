import { useEffect } from "react";
import { Actionable, Country, List, Location, Meta } from "../types";
import MyLists from "./MyLists";
import MyLocations from "./MyLocations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

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
  const auth = useAuth();
  useEffect(() => {
    //Load user lists if not done yet
    if (!myLists) {
      fetchLists();
    }
  }, [myLists]);

  //UNLINK LOCATION
  const unlinkLocation = async (location: Actionable) => {
    if (!selectedList) {
      console.error("Attempted to unlink location without selected list.");
      return;
    }

    // if (!selectedLocation) {
    //   console.error("Attempted to unlink with no selected location.");
    //   return;
    // }

    const unlinkUrl = `http://localhost:8080/api/lists/unlink?listid=${selectedList.id}`;

    //API takes a list of IDs in case of future changes want to unlink many at once
    const requestBody = [location.id];

    const config = {
      headers: {
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    try {
      const response = await axios.put(unlinkUrl, requestBody, config);
      console.log(
        "Unlink location request handled successfully. " + response.data
      );
    } catch (error) {
      console.error(
        "Error unlinking location " +
          location.id +
          " from list " +
          selectedList.id
      );
    }
    fetchLists();
  };

  //Placeholder if lists are not loaded
  if (!myLists) {
    return <div>LOADING</div>;
  }

  //TSX
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
          {selectedList && selectedLocations && metas && countries && (
            <MyLocations
              selectedList={selectedList}
              locations={selectedLocations}
              selectedLocation={selectedLocation}
              metas={metas}
              countries={countries}
              onSelectLocation={onSelectLocation}
              unlinkLocation={unlinkLocation}
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
