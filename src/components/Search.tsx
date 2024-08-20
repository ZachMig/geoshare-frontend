import LocationPreview from "./LocationPreview";
import PublicLists from "./PublicLists";
import { Country, List, Location, Meta } from "../types";
import { useState } from "react";
import PublicLocations from "./PublicLocations";
import "../css/Search.css";
import axios from "axios";

interface SearchProps {
  countries: Country[];
  metas: Meta[];
}

const Search = ({ countries, metas }: SearchProps) => {
  const [searchByUsername, setSearchByUsername] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [searchResponse, setSearchResponse] = useState("");
  const [searchedLists, setSearchedLists] = useState<List[]>();
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const onSelectList = (list: List) => {
    setSelectedList(list);
    //set lists locations as selected
    setSelectedLocations(list.locations);
  };

  const onSelectLocation = (location: Location) => {
    setSelectedLocation(location);
  };

  const flipSearchType = () => {
    setSearchByUsername(!searchByUsername);
  };

  const searchBy = searchByUsername ? "Username" : "List Name";
  const searchByButton = searchByUsername ? "User Search" : "List Search";

  const searchLists = async (e: React.FormEvent) => {
    e.preventDefault();

    let url = "";

    if (searchByUsername) {
      url = `http://localhost:8080/api/lists/findformatted?uname=${searchParam}`;
    } else {
      url = `http://localhost:8080/api/lists/searchlists?includes=${searchParam}`;
    }

    try {
      const response = await axios.get(url);
      const temp: List[] = response.data;
      setSearchedLists(temp);
      if (
        temp.length === 0 ||
        (temp.length === 1 && temp[0].locations.length === 0)
      ) {
        setSearchedLists([]);
        if (searchByUsername) {
          setSearchResponse(
            "No lists found for username: " +
              searchParam +
              ". User likely does not exist."
          );
        } else {
          setSearchResponse(
            "No lists found for list search term: " + searchParam
          );
        }
      } else {
        setSearchResponse("");
      }
    } catch (error) {
      setSearchResponse(
        `Error searching by ${
          searchByUsername ? "username: " : "list name: "
        } ${error}`
      );
    }
  };

  return (
    <div className="container-fluid mt-5 h-100">
      <div className="row">
        <div className="col">
          {/* Search by Username or List Name */}
          <div className="row">
            <span>{searchResponse}</span>
            <form className="d-flex my-1" onSubmit={searchLists}>
              <input
                type="text"
                className="form-control w-75 mx-1"
                placeholder={`Search by ${searchBy}`}
                onChange={(e) => setSearchParam(e.target.value)}
              />
              <input
                className="form-check-input"
                type="checkbox"
                onChange={flipSearchType}
              />
              <button type="submit" className="btn btn-primary w-25 mx-1">
                {searchByButton}
              </button>
            </form>
          </div>
          {/* Lists */}
          {searchedLists && (
            <PublicLists
              allLists={searchedLists}
              selectedList={selectedList}
              onSelectList={onSelectList}
            />
          )}
        </div>
        {/* Locations */}
        <div className="col">
          {selectedLocations && metas && countries && (
            <PublicLocations
              locations={selectedLocations}
              selectedLocation={selectedLocation}
              metas={metas}
              countries={countries}
              onSelectLocation={onSelectLocation}
            />
          )}
        </div>
        {/* Location Preview */}
        <div className="col">
          {selectedLocation && <LocationPreview location={selectedLocation} />}
        </div>
      </div>
    </div>
  );
};

export default Search;
