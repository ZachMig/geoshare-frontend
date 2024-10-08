import { useState } from "react";
import {
  Actionable,
  Country,
  Handlers,
  List,
  Location,
  LocationFilter,
  Meta,
  Stringable,
} from "../types";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import EditLocation from "./EditLocations";
import FilteredDropdown from "./FilteredDropdown";
import { Link } from "react-router-dom";
import ActionIcons from "./ActionIcons";
import ConfirmDelete from "./ConfirmDelete";

interface MyLocationsProps {
  selectedList: List;
  locations: Location[] | null;
  selectedLocation: Location | null;
  metas: Meta[];
  countries: Country[];
  onSelectLocation: (location: Location | null) => void;
  unlinkLocation: (location: Actionable) => void;
  fetchLists: () => {};
}

//MAKE SURE LOCATION FIELDS ARE NOT NULL OR APP WILL CRASH (maybe?)!!!!
//MAKE SURE THERE IS ALWAYS A VALID LIST WITH LOCATIONS OR APP WILL CRASH!!!

//COMPONENT
const MyLocations = ({
  selectedList,
  locations,
  selectedLocation,
  metas,
  countries,
  onSelectLocation,
  unlinkLocation,
  fetchLists,
}: MyLocationsProps) => {
  const auth = useAuth();
  const [filters, setFilters] = useState<LocationFilter>({
    meta: "",
    country: "",
    name: "",
  });

  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleCountrySelect = (country: Stringable) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        country: country.toString(),
      };
    });
  };

  const handleMetaSelect = (meta: Stringable) => {
    setFilters((prevFilters) => {
      return {
        ...prevFilters,
        meta: meta.toString(),
      };
    });
  };

  //EDIT
  const handleLocationEdit = (location: Actionable) => {
    onSelectLocation(location as Location);
    setIsEditVisible(true);
  };

  //Open Modal to Confirm Delete or Not
  const handleLocationDelete = (location: Actionable) => {
    onSelectLocation(location as Location);
    setIsDeleteVisible(true);
  };

  //UNLINK
  const handleLocationUnlink = (location: Actionable) => {
    unlinkLocation(location);
  };

  //Actually Delete
  const sendDeleteRequest = async (location: Actionable) => {
    const deleteUrl = "https://api.geosave.org:8443/api/locations/delete";
    try {
      const response = await axios.delete(deleteUrl, {
        data: [location.id],
        headers: { Authorization: "Bearer " + auth.user.jwt },
      });
      console.log("Delete request ran with no errors. " + response.data);
      fetchLists();
    } catch (error) {
      console.error("Error deleting location: " + location.id + " - " + error);
    }
  };

  //Maintain the subset of locations that match all current filters, extremely readable versionwwww
  const filteredLocations: Location[] | null =
    locations &&
    locations.filter((location: Location) => {
      // If the filter is populated, return true if it matches, otherwise if no match or not populated return false
      // This is pretty hard to read if unfamiliar and should probably be written without ternary operators in the workplace
      // I rewrote it a little more readable in PublicLocations.tsx
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

  //RETURN IF NO LOCATIONS
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

  const handlers: Handlers = {
    handleEdit: handleLocationEdit,
    handleUnlink: handleLocationUnlink,
    handleDelete: handleLocationDelete,
  };

  //TSX RETURN
  return (
    <div>
      {/* Edit Location Modal */}
      {isEditVisible && selectedLocation && (
        <EditLocation
          countries={countries}
          metas={metas}
          location={selectedLocation}
          fetchLists={fetchLists}
          setEditIsVisible={setIsEditVisible}
        />
      )}
      {/* Confirm Delete Modal */}
      {isDeleteVisible && selectedLocation && (
        <ConfirmDelete
          item={selectedLocation}
          itemName={selectedLocation.description}
          sendDeleteRequest={sendDeleteRequest}
          setIsDeleteVisible={setIsDeleteVisible}
        />
      )}
      {/* Filters */}
      <div className="row mb-2 d-flex align-items-end">
        {/* Location Name Filter */}
        <div className="col-sm mx-1">
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            value={filters.name ? filters.name : filters.name} //Populate with filter if it exists, avoids some edge case bugs
            onChange={(e) =>
              setFilters((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
          />
        </div>
        {/* Country Filter */}
        <FilteredDropdown
          dropdownName=""
          items={countries}
          defaultFilter={filters.country ? filters.country : ""}
          defaultValue={filters.country ? filters.country : ""}
          returnItemToParent={handleCountrySelect}
        />
        {/* Meta Filter */}
        <FilteredDropdown
          dropdownName=""
          items={metas}
          defaultFilter={filters.meta ? filters.meta : ""}
          defaultValue={filters.meta ? filters.meta : ""}
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
              <ActionIcons
                item={location}
                showUnlink={selectedList.id != -1}
                handlers={handlers}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MyLocations;
