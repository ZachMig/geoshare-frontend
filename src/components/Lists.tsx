import { List, Data } from "../types";

interface ListsProps {
  data: Data;
  onSelectList: (list: List) => void;
}

const Lists = ({ data, onSelectList }: ListsProps) => {
  return (
    <div>
      <h4>Lists</h4>
      <ul className="list-group">
        <li
          key={data.unlisted.id}
          className="list-group-item list-group-item-action"
          onClick={() => onSelectList(data.unlisted)}
          style={{ cursor: "pointer" }}
        >
          {data.unlisted.name}
        </li>
        {data.listed.map((list) => (
          <li
            key={list.id}
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
