import { useState } from "react";
import { Country, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface CreateLocationProps {
  refreshView: () => void;
  countries: Country[];
  metas: Meta[];
}

//TODO
//NEW DROPDOWN IS STILL BUGGED AFTER SELECT DOESNT POPULATE OR SOMETHING

//COMPONENT
const CreateLocation = ({
  refreshView,
  countries,
  metas,
}: CreateLocationProps) => {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [metaDropdownOpen, setMetaDropdownOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [metaFilter, setMetaFilter] = useState("");
  const [submitResponse, setSubmitResponse] = useState("");
  const [locInfo, setLocInfo] = useState({
    url: "",
    description: "",
    countryName: "",
    meta: "",
    userID: localStorage.getItem("userID"),
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
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    };

    try {
      const response = await axios.post(url, locInfo, config);
      console.log("Create location response: " + response.data);
      setSubmitResponse("Create location response: " + response.data);
      setLocInfo({
        ...locInfo,
        url: "",
        description: "",
        countryName: "",
        meta: "",
      });
      setCountryFilter("");
      setMetaFilter("");
      refreshView();
    } catch (error) {
      console.error("Error creating location: " + error);
      setSubmitResponse("Error creating location: " + error);
    }
  };

  //Return TSX
  return (
    <div>
      <span>{submitResponse}</span>
      <form onSubmit={handleSubmit} className="mt-4 mx-auto">
        <div className="mb-3">
          <label htmlFor="url" className="form-label">
            Street View URL
          </label>
          <input
            type="text"
            className="form-control"
            id="url"
            value={locInfo.url}
            onChange={(e) => setLocInfo({ ...locInfo, url: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="desc" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="desc"
            value={locInfo.description}
            onChange={(e) =>
              setLocInfo({ ...locInfo, description: e.target.value })
            }
            required
          />
        </div>
        <div className="row">
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
        <button type="submit" className="btn btn-primary w-100">
          Add Location
        </button>
      </form>
    </div>
  );
};

export default CreateLocation;
