import { useEffect, useRef } from "react";
import { Actionable } from "../types";

interface ConfirmDeleteProps {
  item: Actionable;
  itemName: string;
  sendDeleteRequest: (item: Actionable) => void;
  setIsDeleteVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmDelete = ({
  item,
  itemName,
  sendDeleteRequest,
  setIsDeleteVisible,
}: ConfirmDeleteProps) => {
  const deleteRef = useRef<any>(null);

  const closeDeleteWindow = () => {
    setIsDeleteVisible(false);
  };

  const handleClickAway = (event: MouseEvent) => {
    //make sure referenced element exists
    if (deleteRef.current) {
      //make sure click target is not referenced element
      if (!deleteRef.current.contains(event.target)) {
        setIsDeleteVisible(false);
      }
    }
  };

  const handleEscAway = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDeleteVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway); //make sure event listener is being removed on unmount
      document.removeEventListener("keydown", handleEscAway);
    };
  }, []);

  const handleSubmit = () => {
    sendDeleteRequest(item);
    setIsDeleteVisible(false);
  };

  return (
    <div className="el-overlay">
      <div ref={deleteRef} className="el-content">
        <h4>Confirm Delete</h4>
        <form onSubmit={handleSubmit} className="mt-3 mx-auto">
          <span>Are you sure you want to delete {itemName}?</span>
          <div className="el-actions">
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
            >
              Delete
            </button>
            <button
              className="btn btn-primary"
              type="button"
              onClick={closeDeleteWindow}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmDelete;
