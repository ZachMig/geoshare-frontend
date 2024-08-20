import { useState } from "react";
import { List } from "../types";
import EditList from "./EditList";
import { FaEdit } from "react-icons/fa";
import "../css/FaIcons.css";
import "../css/Lists.css";
import ListDescription from "./ListDescription";

interface MyListsProps {
  allLists: List[];
  selectedList: List | null;
  onSelectList: (list: List) => void;
  fetchLists: () => {};
}

const MyLists = ({
  allLists,
  selectedList,
  onSelectList,
  fetchLists,
}: MyListsProps) => {
  const [isEditVisible, setIsEditVisible] = useState(false);

  const handleListEdit = (list: List) => {
    setIsEditVisible(true);
    console.log("Edit clicked for list: " + list.name);
  };

  return (
    <div className="list-holder" style={{ maxHeight: "80vh" }}>
      {isEditVisible && selectedList && (
        <EditList
          list={selectedList}
          fetchLists={fetchLists}
          setIsEditVisible={setIsEditVisible}
        />
      )}
      <h4>Lists</h4>
      <ListDescription list={selectedList} />
      <ul className="list-group">
        {allLists.map((list) => (
          <li
            key={list.id}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center
            ${selectedList && selectedList.id === list.id ? "active" : ""}`}
            onClick={() => onSelectList(list)}
            style={{ cursor: "pointer" }}
          >
            {list.name.length > 60 ? list.name.slice(0, 60) + "..." : list.name}
            <div className="icon-group">
              {" "}
              {/* Edit Location Button */}
              <FaEdit
                className="icon"
                onClick={() => handleListEdit(list)}
                title="Edit"
                style={{ marginLeft: "10px", cursor: "pointer" }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLists;
