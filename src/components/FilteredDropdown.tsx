import { useState } from "react";
import "../css/FilteredItems.css";

interface FilteredDropdownProps {
  dropdownName: string;
  items: string[];
  defaultPlaceholder: string;
  returnItemToParent: (item: string) => void;
}

/**
 * @param items must be an array of distinct values
 *
 */
const FilteredDropdown = ({
  dropdownName,
  items,
  defaultPlaceholder,
  returnItemToParent,
}: FilteredDropdownProps) => {
  const [filter, setFilter] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredItems = items.filter((item) => {
    return filter ? item.toLowerCase().includes(filter.toLowerCase()) : true;
  });

  const handleItemChange = (e: any) => {
    setFilter(e.target.value);
    setDropdownOpen(true);
    returnItemToParent(e.target.value);
  };

  const handleItemSelect = (item: string) => {
    setFilter(item);
    setDropdownOpen(false);
    returnItemToParent(item);
  };

  return (
    <div className="dropdown col-sm mx-1">
      <label htmlFor="country" className="form-label">
        {dropdownName}
      </label>
      <input
        type="text"
        id="country"
        className="form-control"
        placeholder={defaultPlaceholder}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onChange={handleItemChange}
        value={filter}
      />
      {dropdownOpen && (
        <ul className="list-group dropdown-menu show">
          {filteredItems.map((item) => (
            <li
              key={item}
              className="list-group-item list-group-item-action"
              onClick={() => handleItemSelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredDropdown;
