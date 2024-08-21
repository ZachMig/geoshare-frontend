import { FaEdit, FaTrash, FaUnlink } from "react-icons/fa";
import "../css/FaIcons.css";
import { Actionable, Handlers } from "../types";

/** So this time I decided to modify this component to handle showing the unlink action or not depending
 * on the type of component it is a child of. If list, then don't show, only show if parent is location type.
 * I chose this way here because I am confident that any future changes to this component will be very small
 * if any so I'm not worried about it getting too large or unreadable.
 */

interface ActionIconsProps {
  //item: List | Location; just using selectedList / selectedLocation - change this here if sync problems, deleting wrong list etc
  item: Actionable;
  showUnlink: boolean;
  handlers: Handlers;
}

const ActionIcons = ({ item, showUnlink, handlers }: ActionIconsProps) => {
  const handleUnlinkAvoidNarrowing = handlers.handleUnlink;

  return (
    <div className="icon-group">
      {/* Edit Location Button */}
      <FaEdit
        className="icon"
        onClick={() => handlers.handleEdit(item)}
        title="Edit"
        style={{ marginLeft: "10px", cursor: "pointer" }}
        color="yellow"
      />
      {/* Unlink Location Button for Locations Only */}
      {showUnlink && handleUnlinkAvoidNarrowing && (
        <FaUnlink
          className="icon"
          onClick={() => handleUnlinkAvoidNarrowing(item)}
          title="Unlink"
          style={{ marginLeft: "10px", cursor: "pointer" }}
          color="red"
        />
      )}
      {/* Delete Location Button */}
      <FaTrash
        className="icon"
        onClick={() => handlers.handleDelete(item)}
        title="Delete"
        style={{ marginLeft: "10px", cursor: "pointer" }}
        color="red"
      />
    </div>
  );
};

export default ActionIcons;
