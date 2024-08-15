import { useState } from "react";
import { Country, List, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface CreateLocationProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  fetchLists: () => {};
}

//TODO
//NEW DROPDOWN IS STILL BUGGED AFTER SELECT DOESNT POPULATE OR SOMETHING

//COMPONENT
const CreateLocation = ({
  countries,
  metas,
  myLists,
  fetchLists,
}: CreateLocationProps) => {
  const auth = useAuth();
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [metaDropdownOpen, setMetaDropdownOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [metaFilter, setMetaFilter] = useState("");
  const [submitResponse, setSubmitResponse] = useState("");
  const [listsToAdd, setListsToAdd] = useState(new Set());
  const [locInfo, setLocInfo] = useState<{
    url: string;
    description: string;
    countryName: string;
    meta: string;
    userID: number;
    listIDs: number[];
  }>({
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

  const filteredCountries = countryNames.filter((name) => {
    return countryFilter
      ? name.toLowerCase().includes(countryFilter.toLowerCase())
      : true;
  });

  const filteredMetas = metaNames.filter((name) => {
    return metaFilter
      ? name.toLowerCase().includes(metaFilter.toLowerCase())
      : true;
  });

  const openCountryDropdown = () => {
    setCountryDropdownOpen(!countryDropdownOpen);
  };

  const openMetaDropdown = () => {
    setMetaDropdownOpen(!metaDropdownOpen);
  };

  const handleCountrySelect = (country: string) => {
    setLocInfo({ ...locInfo, countryName: country });
    setCountryFilter(country);
    setCountryDropdownOpen(false);
  };

  const handleMetaSelect = (meta: string) => {
    setLocInfo({ ...locInfo, meta: meta });
    setMetaFilter(meta);
    setMetaDropdownOpen(false);
  };

  const handleCountryChange = (e: any) => {
    setCountryFilter(e.target.value);
    setCountryDropdownOpen(true);
    setLocInfo({ ...locInfo, countryName: e.target.value });
  };

  const handleMetaChange = (e: any) => {
    setMetaFilter(e.target.value);
    setMetaDropdownOpen(true);
    setLocInfo({ ...locInfo, meta: e.target.value });
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

    const url = `http://localhost:8080/api/locations/create`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    locInfo.listIDs = Array.from(listsToAdd) as number[];

    console.log("LocInfo: " + locInfo);

    try {
      const response = await axios.post(url, locInfo, config);
      console.log("Create location response: " + response.data);
      setSubmitResponse("Create location response: " + response.data);

      //Reset all input fields
      setLocInfo({
        ...locInfo,
        url: "",
        description: "",
        countryName: "",
        meta: "",
      });
      setListsToAdd(new Set());
      setCountryFilter("");
      setMetaFilter("");
      fetchLists();
    } catch (error) {
      console.error("Error creating location: " + error);
      setSubmitResponse("Error creating location: " + error);
    }
  };

  //Return TSX
  return (
    <div>
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
        {/*Country*/}
        <div className="row mt-2">
          <div className="dropdown col-sm mx-1">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              type="text"
              id="country"
              className="form-control"
              placeholder={countries[0].name}
              onClick={openCountryDropdown}
              onChange={handleCountryChange}
              value={countryFilter}
            />
            {countryDropdownOpen && (
              <ul className="list-group dropdown-menu show">
                {filteredCountries.map((country) => (
                  <li
                    key={country}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleCountrySelect(country)}
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/*Meta*/}
          <div className="dropdown col-sm mx-1">
            <label htmlFor="meta" className="form-label">
              Meta
            </label>
            <input
              type="text"
              id="meta"
              className="form-control"
              placeholder={metas[0].name}
              onClick={openMetaDropdown}
              onChange={handleMetaChange}
              value={metaFilter}
            />
            {metaDropdownOpen && (
              <ul className="list-group dropdown-menu show">
                {filteredMetas.map((meta) => (
                  <li
                    key={meta}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleMetaSelect(meta)}
                  >
                    {meta}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
