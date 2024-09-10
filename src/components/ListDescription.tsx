import { useState } from "react";
import { List } from "../types";
import "../css/ListDescription.css";

interface ListDescriptionProps {
  list: List | null;
}

const ListDescription = ({ list }: ListDescriptionProps) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);

  const listDescriptionStub = () => {
    if (!list || isDescriptionVisible) {
      return "";
    }
    if (list.description.length > 50) {
      return list.description.slice(0, 50) + "...";
    } else {
      return list.description;
    }
  };

  const listDescriptionFull = () => {
    if (!list || !isDescriptionVisible) {
      return "";
    }

    if (isDescriptionVisible) {
      return list.description;
    } else {
      return "";
    }
  };

  return (
    <div
      onClick={() => setIsDescriptionVisible(true)}
      onMouseLeave={() => setIsDescriptionVisible(false)}
      style={{ cursor: "pointer" }}
    >
      <span> {listDescriptionStub()}</span>
      {isDescriptionVisible && (
        <div
          className="ld-overlay mt-5 py-0"
          style={{ overflowY: "auto", maxHeight: "500px" }}
        >
          <span>{listDescriptionFull()}</span>
        </div>
      )}
    </div>
  );
};

export default ListDescription;
