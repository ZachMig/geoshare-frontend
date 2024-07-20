import React from "react";
import { List, Data } from "../types";

interface ListsProps {
  data: Data;
  onSelectList: (list: List) => void;
}

const Lists: React.FC<ListsProps> = ({ data, onSelectList }) => {
  return (
    <div>
      <h4>Lists</h4>
      <ul className="list-group">
        {data.listed.map((list) => (
          <li
            key={list.name}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectList(list)}
            style={{ cursor: "pointer" }}
          >
            {list.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lists;
