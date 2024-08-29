import { Location } from "../types.ts";
// import * as testOne from "../assets/sv_test_one.png";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.tsx";

interface LocationPreviewProps {
  location: Location;
}

//TODO PITCH NOT BEING ENCODED CORRECTLY ON BACKEND MOST LIKELY NEGATIVE VALUE BEING LOST !!!!!

const LocationPreview = ({ location }: LocationPreviewProps) => {
  const auth = useAuth();
  const [preview, setPreview] = useState("");
  // const testOneImg = testOne.default;
  // const url = `https://www.${location.url}`;

  const fetchPreview = async (): Promise<string> => {
    const url = `http://localhost:8080/api/locations/preview?id=${location.id}`;
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: "Bearer " + auth.user.jwt,
      },
      responseType: "blob",
    };

    try {
      const response = await axios.get(url, config);
      console.log("Preview fetched successfully.");

      const blob = response.data;
      const localURL = URL.createObjectURL(blob);
      return localURL;
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  useEffect(() => {
    fetchPreview().then((url) => setPreview(url));
  }, []);

  return (
    <div>
      <div className="row">
        <p className="col-5">
          <a href={location.url} target="_blank" rel="noopener noreferrer">
            {location.description}
          </a>
        </p>
        <p className="col-3">Country: {location.countryName}</p>
        <p className="col-2">Meta: {location.meta}</p>
      </div>
      {preview && <img sizes="640x640" src={preview}></img>}
    </div>
  );
};

export default LocationPreview;
