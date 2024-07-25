import { useState, useEffect } from "react";
import { Country, Data, List, Location, Meta } from "../types";
import axios from "axios";
import Lists from "./Lists";
import Locations from "./Locations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";
import CreateLocation from "./CreateLocation";

const My = () => {
  const [data, setData] = useState<Data | null>(null);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [metas, setMetas] = useState<Meta[] | null>(null);
  const [countries, setCountries] = useState<Country[] | null>(null);

  const baseUrl = "http://localhost:8080/api";
  const username = localStorage.getItem("username");

  const callAPI = async () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    try {
      const [countryResponse, metaResponse, dataResponse] = await Promise.all([
        axios.get(`${baseUrl}/countries/findall`, config),
        axios.get(`${baseUrl}/metas/findall`, config),
        axios.get(`${baseUrl}/lists/findformatted?uname=${username}`, config),
      ]);
      const fetchedCOuntries = countryResponse.data;
      const fetchedMetas = metaResponse.data;
      const fetchedData = dataResponse.data;

      setData(fetchedData);
      setCountries(fetchedCOuntries);
      setMetas(fetchedMetas);

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
      console.error("Error with initial Country/Meta/List API calls: ", error);
    }

    setLoading(false); //Handle this better
  };

  useEffect(() => {
    callAPI();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

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
      <div className="row mt-5">
        <div className="col-md-3">LIST CRUD</div>
        <div className="col-md-4">
          {countries && metas && (
            <CreateLocation
              refreshView={callAPI}
              countries={countries}
              metas={metas}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default My;
