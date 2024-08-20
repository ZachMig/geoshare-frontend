import { useEffect, useRef, useState } from "react";
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
  const ulRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [filter, setFilter] = useState(defaultPlaceholder);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleClickAway = (event: MouseEvent) => {
    if (ulRef.current && inputRef.current.contains(event.target)) {
      return;
    }
    if (ulRef.current && ulRef.current.contains(event.target)) {
      return;
    }
    setDropdownOpen(false);
  };

  const handleEscAway = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setDropdownOpen(false);
    }
  };

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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleEscAway);
    };
  }, []);

  return (
    <div className="dropdown col-sm mx-1">
      <label htmlFor="country" className="form-label">
        {dropdownName}
      </label>
      <input
        ref={inputRef}
        type="text"
        id="country"
        className="form-control"
        placeholder={defaultPlaceholder}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onChange={handleItemChange}
        value={filter}
      />
      {dropdownOpen && (
        <ul ref={ulRef} className="list-group dropdown-menu show">
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
