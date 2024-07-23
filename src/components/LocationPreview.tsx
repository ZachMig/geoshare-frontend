import { Location } from "../types.ts";
import * as testOne from "../assets/sv_test_one.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

interface LocationPreviewProps {
  location: Location;
}

const LocationPreview = ({ location }: LocationPreviewProps) => {
  //const mapsAPIKey = "";
  //const url = location.url;
  //const apiCallUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${url}&key=${mapsAPIKey}`;

  const testOneImg = testOne.default;
  const url = `https://www.${location.url}`;

  return (
    <div>
      <div className="row">
        <p className="col-5">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {location.description}
          </a>
        </p>
        <p className="col-3">Country: {location.countryName}</p>
        <p className="col-2">Meta: {location.meta}</p>
      </div>
      <iframe
        width="640"
        height="640"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={testOneImg}
      ></iframe>
    </div>
  );
};

export default LocationPreview;
