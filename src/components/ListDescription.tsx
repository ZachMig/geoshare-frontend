import { useState } from "react";
import { List } from "../types";

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
      onMouseEnter={() => setIsDescriptionVisible(true)}
      onMouseLeave={() => setIsDescriptionVisible(false)}
      style={{ overflowY: "auto", maxHeight: "300px" }}
      className="my-2"
    >
      <span>
        {listDescriptionStub()}
        {listDescriptionFull()}
      </span>
    </div>
  );
};

export default ListDescription;
