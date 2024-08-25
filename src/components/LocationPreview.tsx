import { Location } from "../types.ts";
import * as testOne from "../assets/sv_test_one.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";

interface LocationPreviewProps {
  location: Location;
}

//Figure out how to make this refresh please please please thank you
const LocationPreview = ({ location }: LocationPreviewProps) => {
  //const mapsAPIKey = "";
  //const url = location.url;
  //const apiCallUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${url}&key=${mapsAPIKey}`;

  const [stateUrl, setStateUrl] = useState("");
  const [stateDescription, setStateDescription] = useState("");
  const [stateCountry, setStateCountry] = useState("");
  const [stateMeta, setStateMeta] = useState("");

  useEffect(() => {
    setStateUrl(`https://www.${location.url}`);
    setStateDescription(location.description);
    setStateCountry(location.countryName);
    setStateMeta(location.meta);
  }, [location]);

  const testOneImg = testOne.default;
  // const url = `https://www.${location.url}`;

  return (
    <div>
      <div className="row">
        <p className="col-5">
          <a href={stateUrl} target="_blank" rel="noopener noreferrer">
            {stateDescription}
          </a>
        </p>
        <p className="col-3">Country: {stateCountry}</p>
        <p className="col-2">Meta: {stateMeta}</p>
      </div>
      <iframe
        className="mx-auto"
        width="660"
        height="500"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={testOneImg}
      ></iframe>
    </div>
  );
};

export default LocationPreview;
