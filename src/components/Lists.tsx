import { List } from "../types";

interface ListsProps {
  myLists: List[];
  onSelectList: (list: List) => void;
}

const Lists = ({ myLists, onSelectList }: ListsProps) => {
  return (
    <div>
      <h4>Lists</h4>
      <ul className="list-group">
        {myLists.map((list) => (
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
