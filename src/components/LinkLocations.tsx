import { useEffect, useState } from "react";
import {
  Country,
  List,
  Location,
  LocationFilter,
  Meta,
  Stringable,
} from "../types";
import FilteredDropdown from "./FilteredDropdown";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

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
  const auth = useAuth();
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

  const handleInCountrySelect = (country: Stringable) => {
    setInFilters((prevFilters) => {
      return {
        ...prevFilters,
        country: country.toString(),
      };
    });
  };

  const handleInMetaSelect = (meta: Stringable) => {
    setInFilters((prevFilters) => {
      return {
        ...prevFilters,
        meta: meta.toString(),
      };
    });
  };

  const handleOutCountrySelect = (country: Stringable) => {
    setOutFilters((prevFilters) => {
      return {
        ...prevFilters,
        country: country.toString(),
      };
    });
  };

  const handleOutMetaSelect = (meta: Stringable) => {
    setOutFilters((prevFilters) => {
      return {
        ...prevFilters,
        meta: meta.toString(),
      };
    });
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
      //Create maps of location id -> location to ensure uniqueness
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
    // console.log("Submit clicked!");
    if (!selectedList) {
      console.error("Attempted to swap with no selected list.");
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    //Link locations if any have been selected
    if (locationsToLink.size > 0) {
      const url = `https://api.geosave.org:8443/api/lists/add?listid=${selectedList.id}`;

      try {
        const response = await axios.put(url, [...locationsToLink], config);
        console.log("Link locations handled successfully. " + response.data);
      } catch (error) {
        console.error("Error linking locations to list. " + error);
        return;
      }
    }

    //Unlink locations if any have been selected
    if (locationsToUnlink.size > 0) {
      const url = `https://api.geosave.org:8443/api/lists/unlink?listid=${selectedList.id}`;

      try {
        const response = await axios.put(url, [...locationsToUnlink], config);
        console.log("Unlink locations handled successfully. " + response.data);
      } catch (error) {
        console.error("Error unlinking locations from list. " + error);
        return;
      }
    }

    //Reset relevant state here
    setLocationsToLink(new Set());
    setLocationsToUnlink(new Set());
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
              defaultValue={""}
              defaultFilter={""}
              returnItemToParent={onSelectList}
            />
          )}
        </div>
        <div className="col-2">
          <button
            type="submit"
            onClick={handleSwapSubmit}
            className="btn btn-primary"
          >
            Unlink and Link
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
                setInFilters((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </div>
          {/* Country Filter */}
          <FilteredDropdown
            dropdownName=""
            items={countries}
            defaultFilter={inFilters.country ? inFilters.country : ""}
            defaultValue={""}
            returnItemToParent={handleInCountrySelect}
          />
          {/* Meta Filter */}
          <FilteredDropdown
            dropdownName=""
            items={metas}
            defaultFilter={inFilters.meta ? inFilters.meta : ""}
            defaultValue={""}
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
                setOutFilters((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
            />
          </div>
          {/* Country Filter */}
          <FilteredDropdown
            dropdownName=""
            items={countries}
            defaultFilter={outFilters.country ? outFilters.country : ""}
            defaultValue={""}
            returnItemToParent={handleOutCountrySelect}
          />
          {/* Meta Filter */}
          <FilteredDropdown
            dropdownName=""
            items={metas}
            defaultFilter={outFilters.meta ? outFilters.meta : ""}
            defaultValue={""}
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
