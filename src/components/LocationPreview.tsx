import { Location } from "../types.ts";
import "bootstrap/dist/css/bootstrap.min.css";
import axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.tsx";

interface LocationPreviewProps {
  location: Location;
}

const LocationPreview = ({ location }: LocationPreviewProps) => {
  const auth = useAuth();
  const [preview, setPreview] = useState("");

  const fetchPreview = async (): Promise<string> => {
    const url = `https://api.geosave.org:8443/api/locations/preview?id=${location.id}`;
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
  }, [location.url]);

  return (
    <div>
      <div className="row my-4">
        <p style={{ fontSize: "20px" }} className="col-6">
          Country: {location.countryName}
        </p>
        <p style={{ fontSize: "20px" }} className="col-6">
          Meta: {location.meta}
        </p>
      </div>
      <div className="row">
        {preview && (
          <a href={location.url} target="_blank">
            <img sizes="640x640" src={preview}></img>
          </a>
        )}
      </div>
    </div>
  );
};

export default LocationPreview;
