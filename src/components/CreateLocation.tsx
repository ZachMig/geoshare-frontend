import { useState } from "react";
import { Country, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";

interface CreateLocationProps {
  countries: Country[];
  metas: Meta[];
}

//TODO
//NEW DROPDOWN IS STILL BUGGED AFTER SELECT DOESNT POPULATE OR SOMETHING

//COMPONENT
const CreateLocation = ({ countries, metas }: CreateLocationProps) => {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [metaDropdownOpen, setMetaDropdownOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [metaFilter, setMetaFilter] = useState("");

  const countryNames: string[] = countries.map((country) => country.name);

  const filteredCountries = countryNames.filter((name) => {
    return countryFilter
      ? name.toLowerCase().includes(countryFilter.toLowerCase())
      : true;
  });

  const openCountryDropdown = () => {
    setCountryDropdownOpen(!countryDropdownOpen);
  };

  const openMetaDropdown = () => {
    setMetaDropdownOpen(!metaDropdownOpen);
  };

  const handleCountrySelect = (country: string) => {
    setLocInfo({ ...locInfo, country: country });
    setCountryFilter(country);
    setCountryDropdownOpen(false);
  };

  const handleMetaSelect = (meta: string) => {
    setLocInfo({ ...locInfo, meta: meta });
    setMetaDropdownOpen(false);
  };

  const [locInfo, setLocInfo] = useState({
    url: "",
    desc: "",
    country: "",
    meta: "",
  });

  const handleSubmit = () => {
    //API CALL CREATE
  };

  return (
    <div>
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
            value={locInfo.desc}
            onChange={(e) => setLocInfo({ ...locInfo, desc: e.target.value })}
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
              onChange={(e) => setCountryFilter(e.target.value)}
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
              id="meta"
              className="form-control"
              placeholder={metas[0].name}
              readOnly
              onClick={openMetaDropdown}
              value={locInfo.meta}
            />
            {metaDropdownOpen && (
              <ul className="list-group dropdown-menu show">
                {metas.map((meta) => (
                  <li
                    key={meta.id}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleMetaSelect(meta.name)}
                  >
                    {meta.name}
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
