import { useState } from "react";
import { Country, Location, Meta } from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Locations.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import EditLocation from "./EditLocations";
import FilteredDropdown from "./FilteredDropdown";
import { Link } from "react-router-dom";

interface LocationsProps {
  locations: Location[] | null;
  selectedLocation: Location | null;
  metas: Meta[];
  countries: Country[];
  onSelectLocation: (location: Location | null) => void;
  fetchLists: () => {};
}

interface Filter {
  name: string;
  country: string;
  meta: string;
}

//MAKE SURE LOCATION FIELDS ARE NOT NULL OR APP WILL CRASH (maybe?)!!!!
//MAKE SURE THERE IS ALWAYS A VALID LIST WITH LOCATIONS OR APP WILL CRASH!!!

//COMPONENT
const Locations = ({
  locations,
  selectedLocation,
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

  const [isEditVisible, setIsEditVisible] = useState(false);

  const handleCountrySelect = (country: string) => {
    setFilters({ ...filters, country: country });
  };

  const handleMetaSelect = (meta: string) => {
    setFilters({ ...filters, meta: meta });
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
      onSelectLocation(null);
    } catch (error) {
      console.error(
        "Error deleting location: " + location.description + " - " + error
      );
    }
  };

  const handleLocationEdit = (location: Location) => {
    console.log("Edit clicked for location: " + location.description);
    setIsEditVisible(true);
  };

  //Maintain the subset of locations that match all current filters, extremely readable versionwwww
  const filteredLocations: Location[] | null =
    locations &&
    locations.filter((location: Location) => {
      // If the filter is populated, return true if it matches, otherwise if no match or not populated return false
      // This is pretty hard to read if unfamiliar and should probably be written without ternary operators in the workplace
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

      //Include this location in the filtered list if it matches all current filters
      return nameMatches && countryMatches && metaMatches;
    });

  if (locations && locations.length == 0) {
    return (
      <div className="row px-4 mt-5 d-flex align-items-end">
        <h4>
          No locations added. Go to <Link to="/manage">Manage Locations</Link>{" "}
          to start using Geoshare!
        </h4>
      </div>
    );
  }

  return (
    <div>
      {/* Edit Location Modal */}
      {isEditVisible && selectedLocation && (
        <EditLocation
          countries={countries}
          metas={metas}
          location={selectedLocation}
          fetchLists={fetchLists}
          setEditIsVisisble={setIsEditVisible}
        />
      )}
      {/* Filters */}
      <div className="row px-4 mb-2 d-flex align-items-end">
        {/* Location Name Filter */}
        <div className="col-sm mx-1">
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
        </div>
        {/* Country Filter */}
        <FilteredDropdown
          dropdownName=""
          items={countries.map((country) => country.name)}
          defaultPlaceholder={countries[0].name}
          returnItemToParent={handleCountrySelect}
        />
        {/* Meta Filter */}
        <FilteredDropdown
          dropdownName=""
          items={metas.map((meta) => meta.name)}
          defaultPlaceholder={metas[0].name}
          returnItemToParent={handleMetaSelect}
        />
      </div>
      {/* Filtered Locations */}
      <ul
        className="list-group"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {filteredLocations &&
          filteredLocations.map((location) => (
            <li
              key={location.id}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center
                ${
                  selectedLocation && selectedLocation.id === location.id
                    ? "active"
                    : ""
                }`}
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => onSelectLocation(location)}
            >
              {location.description.length > 80
                ? location.description.slice(0, 80)
                : location.description}
              {/* Action Buttons */}
              <div className="icon-group">
                {/* Edit Location Button */}
                <FaEdit
                  className="icon"
                  onClick={() => handleLocationEdit(location)}
                  title="Edit"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                />
                {/* Delete Location Button */}
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
