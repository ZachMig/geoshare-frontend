import React, { useEffect, useState } from "react";
import { LocInfo, Location } from "../types";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../css/EditLocation.css";

interface EditLocationProps {
  location: Location;
  fetchLists: () => void;
  setEditIsVisisble: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditLocation = ({
  location,
  fetchLists,
  setEditIsVisisble,
}: EditLocationProps) => {
  const auth = useAuth();
  const [locInfo, setLocInfo] = useState<LocInfo>({
    url: "",
    description: "",
    countryName: "",
    meta: "",
    userID: auth.user.id,
    listIDs: [],
  });
  const [submitResponse, setSubmitResponse] = useState("");

  const url = "";

  useEffect(() => {
    setLocInfo({
      url: location.url,
      description: location.description,
      countryName: location.countryName,
      meta: location.meta,
      userID: auth.user.id,
      listIDs: [],
    });
  }, []);

  const handleSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.user.jwt,
        },
      };

      await axios.put(url, locInfo, config);
    } catch (error) {
      console.error("Update location request failed: " + error);
    }

    //Refresh lists
    fetchLists();
  };

  const closeEditWindow = () => {
    setEditIsVisisble(false);
  };

  return (
    <div className="el-overlay">
      <div className="el-content">
        <span>{submitResponse}</span>
        <form onSubmit={handleSubmit} className="mt-3 mx-auto">
          {/*Url*/}
          <div className="mt-2">
            <label htmlFor="url" className="form-label">
              Street View URL
            </label>
            <input
              type="text"
              className="form-control"
              id="url"
              placeholder="google.com/maps/~"
              value={locInfo.url}
              onChange={(e) => setLocInfo({ ...locInfo, url: e.target.value })}
              required
            />
          </div>
          {/*Description*/}
          <div className="mt-2">
            <label htmlFor="desc" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="desc"
              placeholder="Typical east nusa round..."
              value={locInfo.description}
              onChange={(e) =>
                setLocInfo({ ...locInfo, description: e.target.value })
              }
              required
            />
          </div>
          <div className="el-actions">
            <button type="button" onClick={handleSubmit}>
              Submit
            </button>
            <button type="button" onClick={closeEditWindow}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLocation;
