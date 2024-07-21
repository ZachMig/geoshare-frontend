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

const Locations = ({
  list,
  metas,
  countries,
  onSelectLocation,
}: LocationsProps) => {
  const [filters, setFilters] = useState({ meta: "", country: "", name: "" });
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
    setCountryDropdownOpen(false);
  };

  // const filteredLocations = list.locations.filter((location: Location) => {
  //   const nameMatches =
  //     !filters.name ||
  //     location.description.toLowerCase().includes(filters.name.toLowerCase());
  //   const countryMatches =
  //     !filters.country ||
  //     location.country.toLowerCase() === filters.country.toLowerCase();
  //   const metaMatches =
  //     !filters.meta ||
  //     location.meta.toLowerCase() === filters.meta.toLowerCase();

  //   return nameMatches && countryMatches && metaMatches;
  // });

  return (
    <div>
      <div className="row px-4">
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
        {list.locations.map((location) => (
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
