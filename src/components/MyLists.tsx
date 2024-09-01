import { useState } from "react";
import { Actionable, Handlers, List } from "../types";
import EditList from "./EditList";
import "../css/Lists.css";
import ListDescription from "./ListDescription";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import ActionIcons from "./ActionIcons";
import ConfirmDelete from "./ConfirmDelete";

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
  const auth = useAuth();
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const handleListEdit = () => {
    if (!selectedList) {
      console.error("Attempted to edit list with no list selected.");
      return;
    }
    setIsEditVisible(true);
    // console.log("Edit clicked for list: " + selectedList.name);
  };

  const sendDeleteRequest = async (list: Actionable) => {
    if (!selectedList) {
      console.error("Attempted to delete list with no list selected.");
      return;
    }
    // console.log("Delete clicked for list: " + list.id);

    const url = `https://api.geosave.org:8443/api/lists/delete?listid=${list.id}`;

    const config = {
      headers: { Authorization: "Bearer " + auth.user.jwt },
    };

    try {
      const response = await axios.delete(url, config);
      console.log("Delete request ran with no errors. " + response.data);
    } catch (error) {
      console.error("Error deleting list: " + error);
    }

    fetchLists();
  };

  const handleListDelete = (list: Actionable) => {
    onSelectList(list as List);
    setIsDeleteVisible(true);
  };

  const handlers: Handlers = {
    handleEdit: handleListEdit,
    handleUnlink: null,
    handleDelete: handleListDelete,
  };

  return (
    <div className="list-holder" style={{ maxHeight: "80vh" }}>
      {/* Edit List Modal */}
      {isEditVisible && selectedList && (
        <EditList
          list={selectedList}
          fetchLists={fetchLists}
          setIsEditVisible={setIsEditVisible}
        />
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteVisible && selectedList && (
        <ConfirmDelete
          item={selectedList}
          itemName={selectedList.name}
          sendDeleteRequest={sendDeleteRequest}
          setIsDeleteVisible={setIsDeleteVisible}
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

            {list.id != -1 && (
              <ActionIcons item={list} showUnlink={false} handlers={handlers} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyLists;
