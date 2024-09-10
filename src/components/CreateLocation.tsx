import { useState } from "react";
import { Country, List, LocInfo, Meta, Stringable } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import FilteredDropdown from "./FilteredDropdown";

interface CreateLocationProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  fetchLists: () => {};
}

//COMPONENT
const CreateLocation = ({
  countries,
  metas,
  myLists,
  fetchLists,
}: CreateLocationProps) => {
  const auth = useAuth();

  const [submitResponse, setSubmitResponse] = useState("");
  const [listsToAdd, setListsToAdd] = useState(new Set());
  const [locInfo, setLocInfo] = useState<LocInfo>({
    id: "",
    url: "",
    description: "",
    countryName: "",
    meta: "",
    userID: auth.user.id,
    listIDs: [],
  });

  const metaNames: string[] = metas.map((meta) => meta.name);
  const metaNamesLower: string[] = metaNames.map((name) => name.toLowerCase());
  const countryNames: string[] = countries.map((country) => country.name);
  const countryNamesLower: string[] = countryNames.map((name) =>
    name.toLowerCase()
  );

  const handleCountryChange = (selectedCountry: Stringable) => {
    setLocInfo({ ...locInfo, countryName: selectedCountry.toString() });
  };

  const handleMetaChange = (selectedMeta: Stringable) => {
    setLocInfo({ ...locInfo, meta: selectedMeta.toString() });
  };

  //Add the selected list to be included to lists this location
  // will be added to upon creation
  const handleListClick = (id: number) => {
    const temp = new Set(listsToAdd);
    if (temp.has(id)) {
      temp.delete(id);
    } else {
      temp.add(id);
    }
    setListsToAdd(temp);
  };

  //Submit New Location
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!countryNamesLower.includes(locInfo.countryName.toLowerCase())) {
      setSubmitResponse("Please enter a valid country.");
      return;
    }

    if (!metaNamesLower.includes(locInfo.meta.toLowerCase())) {
      setSubmitResponse("Please enter a valid meta.");
      return;
    }

    setSubmitResponse("");

    const url = `https://api.geosave.org:8443/api/locations/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    locInfo.listIDs = Array.from(listsToAdd) as number[];

    // console.log("LocInfo: " + locInfo);

    try {
      const response = await axios.post(url, locInfo, config);
      console.log("Create location response: " + response.data);
      setSubmitResponse("Create location response: " + response.data);

      //Reset some input fields
      setLocInfo({
        ...locInfo,
        url: "",
        description: "",
      });
      setListsToAdd(new Set());
      fetchLists();
    } catch (error) {
      console.error("Error creating location: " + error);
      setSubmitResponse("Error creating location: " + error);
    }
  };

  //Return TSX ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className="mx-2">
      <span>{submitResponse}</span>
      <form onSubmit={handleSubmit} className="mt-3">
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
        {/*Country*/}
        <div className="row mt-2 mx-auto">
          <FilteredDropdown
            dropdownName="Country"
            items={countries}
            defaultFilter={""}
            defaultValue={""}
            returnItemToParent={handleCountryChange}
          />
          {/*Meta*/}
          <FilteredDropdown
            dropdownName="Meta"
            items={metas}
            defaultFilter={""}
            defaultValue={""}
            returnItemToParent={handleMetaChange}
          />
        </div>
        {/*Lists to Include*/}
        <div className="mt-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
          <ul className="list-group">
            {myLists &&
              myLists.slice(1).map((list) => (
                <li
                  key={list.id}
                  className={`list-group-item list-group-item-action
                  ${listsToAdd.has(list.id) ? "active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleListClick(list.id)}
                >
                  {list.name.length > 80
                    ? list.name.slice(0, 80) + "..."
                    : list.name}
                </li>
              ))}
          </ul>
        </div>
        {/*Submit Button*/}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Create New Location
        </button>
      </form>
    </div>
  );
};

export default CreateLocation;
