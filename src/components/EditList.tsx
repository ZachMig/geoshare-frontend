import { useEffect, useRef, useState } from "react";
import { List, ListInfo } from "../types";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../css/EditModal.css";

interface EditListProps {
  list: List;
  fetchLists: () => {};
  setIsEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditList = ({
  list,
  fetchLists,
  setIsEditVisible: setIsEditVisible,
}: EditListProps) => {
  const auth = useAuth();
  const editRef = useRef<any>(null);
  const [submitResponse, setSubmitResponse] = useState("");
  const [updatedListInfo, setUpdatedListInfo] = useState<ListInfo>({
    id: "",
    name: "",
    description: "",
  });

  //Close modal on click away from popup
  const handleClickAway = (event: MouseEvent) => {
    //make sure referenced element exists
    if (editRef.current) {
      //make sure click target is not referenced element
      if (!editRef.current.contains(event.target)) {
        setIsEditVisible(false);
      }
    }
  };

  //Close modal on Esc press
  const handleEscAway = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsEditVisible(false);
    }
  };

  //Setup and teardown of event listeners so user can intuitively close modal
  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway); //make sure event listener is being removed on unmount
      document.removeEventListener("keydown", handleEscAway);
    };
  }, []);

  useEffect(() => {
    setUpdatedListInfo({
      id: list.id.toString(),
      name: list.name,
      description: list.description,
    });
  }, []);

  const closeEditWindow = () => {
    setIsEditVisible(false);
  };

  const handleSubmit = async () => {
    if (!updatedListInfo.name) {
      setSubmitResponse("Please enter a valid name.");
      return;
    }

    if (!updatedListInfo.description) {
      setSubmitResponse("Please enter a valid description.");
      return;
    }

    const url = "https://api.geosave.org:8443/api/lists/update";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.user.jwt,
      },
    };

    try {
      await axios.put(url, updatedListInfo, config);

      console.log("List update request ran without error.");

      setUpdatedListInfo({
        id: list.id.toString(),
        name: "",
        description: "",
      });

      //Refresh lists to get latest edit
      fetchLists();
      closeEditWindow();
    } catch (error) {
      setSubmitResponse("Error updating list: " + error);
      console.error(error);
    }
  };

  return (
    <div className="el-overlay">
      <div ref={editRef} className="el-content">
        <h4>Edit List</h4>
        <span>{submitResponse}</span>
        <form onSubmit={handleSubmit} className="mt-3 mx-auto">
          {/* Name */}
          <div className="row mt-2">
            <label htmlFor="list-name" className="form-label">
              List Name
            </label>
            <input
              type="text"
              className="form-control"
              id="list-name"
              placeholder="Really cool list"
              value={updatedListInfo.name}
              onChange={(e) =>
                setUpdatedListInfo((prev) => {
                  return { ...prev, name: e.target.value };
                })
              }
              required
            />
          </div>
          {/* Description */}
          <div className="row mt-2">
            <label htmlFor="list-desc" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="list-desc"
              placeholder="Really cool list description"
              value={updatedListInfo.description}
              onChange={(e) =>
                setUpdatedListInfo((prev) => {
                  return {
                    ...prev,
                    description: e.target.value,
                  };
                })
              }
              required
            />
          </div>
          <div className="el-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={closeEditWindow}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditList;
