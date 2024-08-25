import { Location } from "../types.ts";
import * as testOne from "../assets/sv_test_one.png";
import "bootstrap/dist/css/bootstrap.min.css";

interface LocationPreviewProps {
  location: Location;
}

const LocationPreview = ({ location }: LocationPreviewProps) => {
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
