import { useEffect, useState } from "react";
import { Country, List, Location, LocationFilter, Meta } from "../types";
import FilteredDropdown from "./FilteredDropdown";

interface LinkLocationsProps {
  countries: Country[];
  metas: Meta[];
  myLists: List[] | null;
  fetchLists: () => void;
}

const LinkLocations = ({
  countries,
  metas,
  myLists,
  fetchLists,
}: LinkLocationsProps) => {
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [inLocations, setInLocations] = useState(new Map<number, Location>());
  const [outLocations, setOutLocations] = useState(new Map<number, Location>());
  const [locationsToLink, setLocationsToLink] = useState(new Set<string>());
  const [locationsToUnlink, setLocationsToUnlink] = useState(new Set<string>());

  const [inFilters, setInFilters] = useState<LocationFilter>({
    name: "",
    country: "",
    meta: "",
  });

  const [outFilters, setOutFilters] = useState<LocationFilter>({
    name: "",
    country: "",
    meta: "",
  });

  const onSelectList = (list: List) => {
    setSelectedList(list);
    // Should probably reset all locations here and treat it as a fresh start
    // probably with a useEffect that sets locations
  };

  //Implement toString() on each list so we can use in dropdown and remove unlisted list
  const stringedListsForDropdown = () => {
    if (!myLists) {
      return [];
    }
    myLists.forEach((list) => {
      list.toString = function () {
        return this.name;
      };
    });

    return myLists.slice(1);
  };

  const handleInCountrySelect = (country: string) => {
    setInFilters({ ...inFilters, country: country });
  };

  const handleInMetaSelect = (meta: string) => {
    setInFilters({ ...inFilters, meta: meta });
  };

  const handleOutCountrySelect = (country: string) => {
    setOutFilters({ ...outFilters, country: country });
  };

  const handleOutMetaSelect = (meta: string) => {
    setOutFilters({ ...outFilters, meta: meta });
  };

  const toggleLocationToBeLinked = (locationID: string) => {
    const temp = new Set(locationsToLink);
    if (temp.has(locationID)) {
      temp.delete(locationID);
    } else {
      temp.add(locationID.toString());
    }
    setLocationsToLink(temp);
  };

  const toggleLocationToBeUnlinked = (locationID: string) => {
    const temp = new Set(locationsToUnlink);
    if (temp.has(locationID)) {
      temp.delete(locationID);
    } else {
      temp.add(locationID.toString());
    }
    setLocationsToUnlink(temp);
  };

  //Make single array of all locations to split into included/exclused in/out
  useEffect(() => {
    if (!myLists) {
      return;
    }

    //When myLists refreshes, see if the previously selected list is still here by ID (it should be)
    // then set the new selectedList to the refreshed copy of itself just fetched
    if (selectedList) {
      const prevSelectedList = myLists.find(
        (list) => list.id === selectedList.id
      );
      if (prevSelectedList) {
        setSelectedList(prevSelectedList);
      }
    }

    const temp = myLists ? myLists.flatMap((list) => list.locations) : [];

    setAllLocations(temp);
  }, [myLists]);

  //Set or Reset all locations on list change or mount
  useEffect(() => {
    if (selectedList && selectedList.locations) {
      const asyncHateInLocations = new Map<number, Location>(
        selectedList.locations.map((loc) => [loc.id, loc])
      );

      //Find the locations that are in allLocations but not in inLocations
      const diffLocations = allLocations.filter(
        (loc) => !asyncHateInLocations.has(loc.id)
      );
      const asyncHateOutLocations = new Map<number, Location>(
        diffLocations.map((loc) => [loc.id, loc])
      );

      setInLocations(asyncHateInLocations);
      setOutLocations(asyncHateOutLocations);
    } else {
      setInLocations(new Map());
      setOutLocations(new Map());
    }
  }, [selectedList, allLocations]);

  const filteredInLocations: Location[] | null =
    inLocations &&
    [...inLocations.values()].filter((location: Location) => {
      const nameMatches = inFilters.name
        ? location.description
            .toLowerCase()
            .includes(inFilters.name.toLowerCase())
        : true;
      const countryMatches = inFilters.country
        ? location.countryName.toLowerCase() === inFilters.country.toLowerCase()
        : true;
      const metaMatches = inFilters.meta
        ? location.meta.toLowerCase() === inFilters.meta.toLowerCase()
        : true;

      return nameMatches && countryMatches && metaMatches;
    });

  const filteredOutLocations: Location[] | null =
    outLocations &&
    [...outLocations.values()].filter((location: Location) => {
      const nameMatches = outFilters.name
        ? location.description
            .toLowerCase()
            .includes(outFilters.name.toLowerCase())
        : true;
      const countryMatches = outFilters.country
        ? location.countryName.toLowerCase() ===
          outFilters.country.toLowerCase()
        : true;
      const metaMatches = outFilters.meta
        ? location.meta.toLowerCase() === outFilters.meta.toLowerCase()
        : true;

      return nameMatches && countryMatches && metaMatches;
    });

  //SUBMIT LINK/UNLINK API CALLS
  const handleSwapSubmit = async () => {
    //addLocationsTo...
    //unlinkLocationsFrom...
    fetchLists();
  };

  //RETURN TSX ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <div className="mx-2">
      {/* Row of List Name Filter */}
      <div className="row me-2 mt-4 d-flex align-items-end">
        <div className="col-10">
          {myLists && (
            <FilteredDropdown
              dropdownName={"Select A List"}
              items={stringedListsForDropdown()} // don't pass in Unlisted list
              // defaultFilter={listFilter ? listFilter : ""}
              defaultFilter={""}
              returnItemToParent={onSelectList}
            />
          )}
        </div>
        <div className="col-2">
          <button
            type="submit"
            onSubmit={handleSwapSubmit}
            className="btn btn-primary"
          >
            Submit Changes
          </button>
        </div>
      </div>
      {/* Row of Location Filters */}
      <div className="row mt-3">
        {/* Left Side Dropdowns */}
        <div className="col-6 d-flex align-items-end">
          {/* Location Name Filter */}
          <div className="col-sm mx-1">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              value={inFilters.name ? inFilters.name : inFilters.name} //Populate with filter if it exists, avoids some edge case bugs
              onChange={(e) =>
                setInFilters({ ...inFilters, name: e.target.value })
              }
            />
          </div>
          {/* Country Filter */}
          <FilteredDropdown
            dropdownName=""
            items={countries.map((country) => country.name)}
            defaultFilter={inFilters.country ? inFilters.country : ""}
            returnItemToParent={handleInCountrySelect}
          />
          {/* Meta Filter */}
          <FilteredDropdown
            dropdownName=""
            items={metas.map((meta) => meta.name)}
            defaultFilter={inFilters.meta ? inFilters.meta : ""}
            returnItemToParent={handleInMetaSelect}
          />
        </div>
        {/* Right Side Dropdowns */}
        <div className="col-6 d-flex align-items-end">
          {/* Location Name Filter */}
          <div className="col-sm mx-1">
            <input
              className="form-control"
              type="text"
              placeholder="Name"
              value={outFilters.name ? outFilters.name : outFilters.name} //Populate with filter if it exists, avoids some edge case bugs
              onChange={(e) =>
                setOutFilters({ ...outFilters, name: e.target.value })
              }
            />
          </div>
          {/* Country Filter */}
          <FilteredDropdown
            dropdownName=""
            items={countries.map((country) => country.name)}
            defaultFilter={outFilters.country ? outFilters.country : ""}
            returnItemToParent={handleOutCountrySelect}
          />
          {/* Meta Filter */}
          <FilteredDropdown
            dropdownName=""
            items={metas.map((meta) => meta.name)}
            defaultFilter={outFilters.meta ? outFilters.meta : ""}
            returnItemToParent={handleOutMetaSelect}
          />
        </div>
      </div>
      {/* Row of Filtered Locations */}
      <div className="row mt-2">
        {/* Filtered Left Side */}
        <div className="col-6" style={{ overflow: "auto" }}>
          <ul
            className="list-group"
            style={{ maxHeight: "63.5vh", overflowY: "auto" }}
          >
            {filteredInLocations &&
              filteredInLocations.map((location) => (
                <li
                  key={location.id}
                  className={`list-group-item list-group-item-action
                    ${
                      locationsToUnlink.has(location.id.toString())
                        ? "active"
                        : ""
                    }`}
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() =>
                    toggleLocationToBeUnlinked(location.id.toString())
                  }
                >
                  {location.description.length > 80
                    ? location.description.slice(0, 80)
                    : location.description}
                </li>
              ))}
          </ul>
        </div>
        {/* Filtered Right Side */}
        <div className="col-6">
          <ul
            className="list-group"
            style={{ maxHeight: "63.5vh", overflowY: "auto" }}
          >
            {filteredOutLocations &&
              filteredOutLocations.map((location) => (
                <li
                  key={location.id}
                  className={`list-group-item list-group-item-action 
                      ${
                        locationsToLink.has(location.id.toString())
                          ? "active"
                          : ""
                      }`}
                  style={{ cursor: "pointer", position: "relative" }}
                  onClick={() =>
                    toggleLocationToBeLinked(location.id.toString())
                  }
                >
                  {location.description.length > 80
                    ? location.description.slice(0, 80)
                    : location.description}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LinkLocations;
