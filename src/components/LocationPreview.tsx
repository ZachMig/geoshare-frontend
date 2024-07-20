import { Location } from "../types.ts";
import * as testOne from "../assets/sv_test_one.png";

interface LocationPreviewProps {
  location: Location;
}

const LocationPreview = ({ location }: LocationPreviewProps) => {
  //const mapsAPIKey = "";
  //const url = location.url;
  //const apiCallUrl = `https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${url}&key=${mapsAPIKey}`;

  const testOneImg = testOne.default;

  return (
    <div>
      <h4>Preview</h4>
      <p>{location.description}</p>
      <iframe
        width="100%"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src={testOneImg}
      ></iframe>
    </div>
  );
};

export default LocationPreview;
