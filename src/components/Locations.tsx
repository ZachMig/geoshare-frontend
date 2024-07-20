import React from "react";
import { List, Location } from "../types";

interface LocationsProps {
  list: List;
  onSelectLocation: (location: Location) => void;
}

const Locations: React.FC<LocationsProps> = ({ list, onSelectLocation }) => {
  return (
    <div>
      <h4>Locations</h4>
      <ul className="list-group">
        {list.locations.map((location) => (
          <li
            key={location.url}
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
