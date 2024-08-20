import React, { useEffect, useRef, useState } from "react";
import { Country, LocInfo, Location, Meta } from "../types";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../css/EditModal.css";
import FilteredDropdown from "./FilteredDropdown";

interface EditLocationProps {
  location: Location;
  countries: Country[];
  metas: Meta[];
  fetchLists: () => void;
  setEditIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditLocation = ({
  location,
  countries,
  metas,
  fetchLists,
  setEditIsVisible,
}: EditLocationProps) => {
  const auth = useAuth();
  const [updatedLocInfo, setUpdatedLocInfo] = useState<LocInfo>({
    id: "",
    url: "",
    description: "",
    countryName: "",
    meta: "",
    userID: auth.user.id,
    listIDs: [],
  });
  const editRef = useRef<any>(null);
  const [submitResponse, setSubmitResponse] = useState("");

  const handleClickAway = (event: MouseEvent) => {
    //make sure referenced element exists
    if (editRef.current) {
      //make sure click target is not referenced element
      if (!editRef.current.contains(event.target)) {
        setEditIsVisible(false);
      }
    }
  };

  const handleEscAway = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setEditIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway); //make sure event listener is being removed on unmount
      document.removeEventListener("keydown", handleEscAway);
    };
  }, []);

  const url = "http://localhost:8080/api/locations/update";

  const countryNamesLower = countries.map((country) =>
    country.name.toLowerCase()
  );
  const metaNamesLower = metas.map((meta) => meta.name.toLowerCase());

  useEffect(() => {
    setUpdatedLocInfo({
      id: location.id.toString(),
      url: location.url,
      description: location.description,
      countryName: location.countryName,
      meta: location.meta,
      userID: auth.user.id,
      listIDs: [],
    });
  }, []);

  const handleSubmit = async () => {
    if (!countryNamesLower.includes(updatedLocInfo.countryName.toLowerCase())) {
      setSubmitResponse("Please enter a valid country.");
      return;
    }

    if (!metaNamesLower.includes(updatedLocInfo.meta.toLowerCase())) {
      setSubmitResponse("Please enter a valid meta.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.user.jwt,
        },
      };

      const response = await axios.put(url, updatedLocInfo, config);

      console.log("Update location response: " + response.data);
      setSubmitResponse("Update location response: " + response.data);

      //Reset info to update
      setUpdatedLocInfo({
        ...updatedLocInfo,
        url: "",
        description: "",
        countryName: "",
        meta: "",
      });
      closeEditWindow();
      //Refresh lists
      fetchLists();
    } catch (error) {
      console.error("Update location request failed: " + error);
    }
  };

  const closeEditWindow = () => {
    setEditIsVisible(false);
  };

  const handleCountryChange = (selectedCountry: string) => {
    setUpdatedLocInfo({ ...updatedLocInfo, countryName: selectedCountry });
  };

  const handleMetaChange = (selectedMeta: string) => {
    setUpdatedLocInfo({ ...updatedLocInfo, meta: selectedMeta });
  };

  return (
    <div className="el-overlay">
      <div ref={editRef} className="el-content">
        <h4>Edit Location</h4>
        <span>{submitResponse}</span>
        <form onSubmit={handleSubmit} className="mt-3 mx-auto">
          {/* Url */}
          <div className="row mt-2">
            <label htmlFor="url" className="form-label">
              Street View URL
            </label>
            <input
              type="text"
              className="form-control"
              id="url"
              placeholder="google.com/maps/~"
              value={updatedLocInfo.url}
              onChange={(e) =>
                setUpdatedLocInfo({ ...updatedLocInfo, url: e.target.value })
              }
              required
            />
          </div>
          {/* Description */}
          <div className="row mt-2">
            <label htmlFor="desc" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="desc"
              placeholder="Typical east nusa round..."
              value={updatedLocInfo.description}
              onChange={(e) =>
                setUpdatedLocInfo({
                  ...updatedLocInfo,
                  description: e.target.value,
                })
              }
              required
            />
          </div>
          {/* Country */}
          <div className="row mt-2">
            <FilteredDropdown
              dropdownName="Country"
              items={countries.map((country) => country.name)}
              defaultPlaceholder={location.countryName}
              returnItemToParent={handleCountryChange}
            />
            {/* Meta */}
            <FilteredDropdown
              dropdownName="Meta"
              items={metas.map((meta) => meta.name)}
              defaultPlaceholder={location.meta}
              returnItemToParent={handleMetaChange}
            />
          </div>
          <div className="el-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={closeEditWindow}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLocation;
