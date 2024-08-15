import { useState } from "react";
import { Country, Location, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Locations.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

interface LocationsProps {
  locations: Location[] | null;
  metas: Meta[];
  countries: Country[];
  onSelectLocation: (location: Location) => void;
  fetchLists: () => {};
}

interface Filter {
  name: string;
  country: string;
  meta: string;
}

//MAKE SURE LOCATION FIELDS ARE NOT NULL OR APP WILL CRASH!!!!
//MAKE SURE THERE IS ALWAYS A VALID LIST WITH LOCATIONS OR APP WILL CRASH!!!

//COMPONENT
const Locations = ({
  locations,
  metas,
  countries,
  onSelectLocation,
  fetchLists,
}: LocationsProps) => {
  const auth = useAuth();
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

  const handleLocationDelete = async (location: Location) => {
    //kill it
    const deleteUrl = "http://localhost:8080/api/locations/delete";
    try {
      const response = await axios.delete(deleteUrl, {
        data: [location.id],
        headers: { Authorization: "Bearer " + auth?.user?.jwt },
      });
      console.log("Delete request ran with no errors. " + response.data);
      fetchLists();
    } catch (error) {
      console.error(
        "Error deleting location: " + location.description + " - " + error
      );
    }
  };

  const handleLocationEdit = (location: Location) => {
    //make an edit popup or something
  };

  //Maintain the subset of locations that match all current filters
  const filteredLocations: Location[] | null =
    locations &&
    locations.filter((location: Location) => {
      // If the filter is populated, return true if it matches, otherwise if no match or not populated return false
      // This is pretty hard to read and should probably be written without ternary operators in the workplace
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
    });

  if (locations && locations.length == 0) {
    return (
      <h4>
        No locations added. Go to "Manage Locations" to start using Geoshare!
      </h4>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="row px-4 mb-2">
        {/* Location Name Filter */}
        <input
          className="col-sm mx-1"
          type="text"
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        {/* Country Filter */}
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
        {/* Meta Filter */}
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
      {/* Locations */}
      <ul
        className="list-group"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {filteredLocations &&
          filteredLocations.map((location) => (
            <li
              key={location.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => onSelectLocation(location)}
            >
              {location.description.length > 80
                ? location.description.slice(0, 80)
                : location.description}
              <div className="icon-group">
                <FaEdit
                  className="icon"
                  onClick={() => handleLocationEdit(location)}
                  title="Edit"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                />
                <FaTrash
                  className="icon"
                  onClick={() => handleLocationDelete(location)}
                  title="Delete"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                />
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Locations;
