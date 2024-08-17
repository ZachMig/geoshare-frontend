import { List } from "../types";

interface ListsProps {
  myLists: List[];
  selectedList: List | null;
  onSelectList: (list: List) => void;
}

const Lists = ({ myLists, selectedList, onSelectList }: ListsProps) => {
  return (
    <div style={{ maxHeight: "80vh" }}>
      <h4>Lists</h4>
      <ul className="list-group">
        {myLists.map((list) => (
          <li
            key={list.id}
            className={`list-group-item list-group-item-action
            ${selectedList && selectedList.id === list.id ? "active" : ""}`}
            onClick={() => onSelectList(list)}
            style={{ cursor: "pointer" }}
          >
            {list.name.length > 60 ? list.name.slice(0, 60) + "..." : list.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lists;
