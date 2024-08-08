import { useState, useEffect } from "react";
import { Country, Data, List, Location, Meta } from "../types";
import axios from "axios";
import Lists from "./Lists";
import Locations from "./Locations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";

interface MyProps {
  countries: Country[];
  metas: Meta[];
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
}

//COMPONENT
const My = ({ countries, metas, data, setData }: MyProps) => {
  //const [data, setData] = useState<Data | null>(null);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  //FETCH LISTS
  const callAPI = async () => {
    const username = localStorage.getItem("username");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    try {
      const dataResponse = await axios.get(
        `http://localhost:8080/api/lists/findformatted?uname=${username}`,
        config
      );

      const fetchedData: Data = dataResponse.data;

      setData(fetchedData);

      //Set default selected List
      if (fetchedData.unlisted.locations.length > 0) {
        setSelectedList(fetchedData.unlisted);
      } else if (
        fetchedData.listed &&
        fetchedData.listed[0].locations.length > 0
      ) {
        setSelectedList(fetchedData.listed[0]);
      }
    } catch (error) {
      console.error("Error with initial List API call: ", error);
    }
  };

  //USEEFFECT STUB
  useEffect(() => {
    callAPI();
  }, []);

  if (!data) {
    return <div>LOADING</div>;
  }

  //JSX
  return (
    <div className="container-fluid mt-5 h-100">
      <div className="row">
        <div className="col-md-3">
          {data && <Lists data={data} onSelectList={setSelectedList} />}
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
