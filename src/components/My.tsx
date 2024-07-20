import { useState, useEffect } from "react";
import { Data, List, Location } from "../types";
import axios from "axios";
import Lists from "./Lists";
import Locations from "./Locations";
import LocationPreview from "./LocationPreview";
import "bootstrap/dist/css/bootstrap.min.css";

const My = () => {
  const [data, setData] = useState<Data | null>(null);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const baseUrl = "http://localhost:8080";
  const username = localStorage.getItem("username");

  useEffect(() => {
    const url = `${baseUrl}/api/lists/findformatted?uname=${username}`;
    console.log(`Pinging ${url}`);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    axios.get(url, config).then(function (response) {
      setData(response.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <div className="col-md-3">
          {data && <Lists data={data} onSelectList={setSelectedList} />}
        </div>
        <div className="col-md-4">
          {selectedList && (
            <Locations
              list={selectedList}
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
