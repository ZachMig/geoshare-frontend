import { useState } from "react";
import { Country, Meta, Location, LocationFilter } from "../types";
import FilteredDropdown from "./FilteredDropdown";

/**
 * Yes I made another Locations-type component instead of re-using MyLocations.tsx here. (Previously just Locations.tsx)
 * There are different functionality and display requirements for locations that a user
 *  has searched up versus ones that the user owns.
 * I looked at what it would take to refactor MyLocations.tsx to handle both sets of
 *  requirements, and decided it would be better to have two components instead.
 * I would rather have two files with logic that is easy to read and follow. This also
 *  allows me to more easily expand the specialized functionality of each component
 *  separately in the future if I choose to add features.
 */

interface PublicLocationsProps {
  locations: Location[];
  selectedLocation: Location | null;
  countries: Country[];
  metas: Meta[];
  onSelectLocation: (location: Location) => void;
}

const PublicLocations = ({
  locations,
  selectedLocation,
  countries,
  metas,
  onSelectLocation,
}: PublicLocationsProps) => {
  const [filters, setFilters] = useState<LocationFilter>({
    meta: "",
    country: "",
    name: "",
  });

  const handleCountrySelect = (country: string) => {
    setFilters({ ...filters, country: country });
  };

  const handleMetaSelect = (meta: string) => {
    setFilters({ ...filters, meta: meta });
  };

  /**
   * Same function as in Locations.tsx but written more verbosely and slightly more readable?
   * For each filter type, if the user has set a value in that filter, check if it matches each location
   *  and if it does, include that location in the filtered locations list.
   */
  const filteredLocations = locations.filter((location) => {
    let nameMatches = true;
    let countryMatches = true;
    let metaMatches = true;

    if (filters.name) {
      nameMatches = location.description
        .toLowerCase()
        .includes(filters.name.toLowerCase());
    }

    if (filters.country) {
      countryMatches = location.countryName
        .toLowerCase()
        .includes(filters.country.toLowerCase());
    }

    if (filters.meta) {
      metaMatches = location.meta
        .toLowerCase()
        .includes(filters.meta.toLowerCase());
    }

    return nameMatches && countryMatches && metaMatches;
  });

  return (
    <div>
      {/* Filters */}
      <div className="row mb-2 d-flex align-items-end">
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
          defaultFilter={filters.country ? filters.country : ""}
          returnItemToParent={handleCountrySelect}
        />
        {/* Meta Filter */}
        <FilteredDropdown
          dropdownName=""
          items={metas.map((meta) => meta.name)}
          defaultFilter={filters.meta ? filters.meta : ""}
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
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PublicLocations;
