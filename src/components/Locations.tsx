import { useState } from "react";
import { Country, List, Location, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Locations.css";

interface LocationsProps {
  list: List;
  metas: Meta[];
  countries: Country[];
  onSelectLocation: (location: Location) => void;
}

interface Filter {
  name: string;
  country: string;
  meta: string;
}

//COMPONENT
const Locations = ({
  list,
  metas,
  countries,
  onSelectLocation,
}: LocationsProps) => {
  const [filters, setFilters] = useState<Filter>({
    meta: "",
    country: "",
    name: "",
  });
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [metaDropdownOpen, setMetaDropdownOpen] = useState(false);

  const openCountryDropdown = () => {
    setCountryDropdownOpen(!countryDropdownOpen);
  };

  const openMetaDropdown = () => {
    setMetaDropdownOpen(!metaDropdownOpen);
  };

  const handleCountrySelect = (country: string) => {
    setFilters({ ...filters, country: country });
    setCountryDropdownOpen(false);
  };

  const handleMetaSelect = (meta: string) => {
    setFilters({ ...filters, meta: meta });
    setMetaDropdownOpen(false);
  };

  //MAKE SURE LOCATION FIELDS ARE NOT NULL OR APP WILL CRASH!!!!
  //MAKE SURE THERE IS ALWAYS A VALID LIST WITH LOCATIONS OR APP WILL CRASH!!!
  const filteredLocations: Location[] = list.locations.filter(
    (location: Location) => {
      const nameMatches = filters.name
        ? location.description
            .toLowerCase()
            .includes(filters.name.toLowerCase())
        : true;
      const countryMatches = filters.country
        ? location.countryName.toLowerCase() === filters.country.toLowerCase()
        : true;
      const metaMatches = filters.meta
        ? location.meta.toLowerCase() === filters.meta.toLowerCase()
        : true;

      return nameMatches && countryMatches && metaMatches;
    }
  );

  return (
    <div>
      <div className="row px-4 mb-2">
        <input
          className="col-sm mx-1"
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <div className="dropdown col-sm mx-1">
          <input
            className="form-control"
            placeholder="Country"
            readOnly
            onClick={openCountryDropdown}
            value={filters.country || ""}
          />
          {countryDropdownOpen && (
            <ul className="list-group dropdown-menu show">
              <li
                key="Clear_Country"
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setFilters({ ...filters, country: "" });
                  setCountryDropdownOpen(false);
                }}
              >
                Reset Filter
              </li>
              {countries.map((country) => (
                <li
                  key={country.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleCountrySelect(country.name)}
                >
                  {country.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dropdown col-sm mx-1">
          <input
            className="form-control"
            placeholder="Meta"
            readOnly
            onClick={openMetaDropdown}
            value={filters.meta}
          />
          {metaDropdownOpen && (
            <ul className="list-group dropdown-menu show">
              <li
                key="Clear_Meta"
                className="list-group-item list-group-item-action"
                onClick={() => {
                  setFilters({ ...filters, meta: "" });
                  setMetaDropdownOpen(false);
                }}
              >
                Reset Filter
              </li>
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
      <ul className="list-group">
        {filteredLocations.map((location) => (
          <li
            key={location.id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectLocation(location)}
            style={{ cursor: "pointer" }}
          >
            {location.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Locations;
