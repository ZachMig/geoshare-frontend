import { List } from "../types";
import ListDescription from "./ListDescription";

/**
 * ~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!!!!!!!!!!~~~~~~~~~~
 * Please see PublicLocations.tsx for an explanation on why I decided to make this
 *  a separate component from MyLists.tsx instead of keeping all the logic in one.
 */

interface PublicListsProps {
  allLists: List[];
  selectedList: List | null;
  onSelectList: (list: List) => void;
}

const PublicLists = ({
  allLists,
  selectedList,
  onSelectList,
}: PublicListsProps) => {
  return (
    <div style={{ maxHeight: "80vh", overflow: "auto" }}>
      <h4>Lists</h4>
      <ListDescription list={selectedList} />
      <ul className="list-group">
        {allLists.map((list) => (
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

export default PublicLists;
