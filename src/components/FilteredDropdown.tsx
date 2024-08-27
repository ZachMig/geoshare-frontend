import { useEffect, useRef, useState } from "react";
import "../css/FilteredItems.css";

interface FilteredDropdownProps<T> {
  dropdownName: string;
  items: T[];
  defaultFilter: string;
  defaultValue: string;
  returnItemToParent: (item: T) => void;
}

/**
 * @param items must be an array of distinct returns of toString()
 *
 */
const FilteredDropdown = <T extends { toString(): string }>({
  dropdownName,
  items,
  defaultFilter,
  defaultValue,
  returnItemToParent,
}: FilteredDropdownProps<T>) => {
  const ulRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [filter, setFilter] = useState(defaultFilter.toString());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleValue, setVisibleValue] = useState(defaultValue);

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
    return filter
      ? item.toString().toLowerCase().includes(filter.toString().toLowerCase())
      : true;
  });

  const handleItemChange = (e: any) => {
    setFilter(e.target.value);
    setVisibleValue(e.target.value);
    setDropdownOpen(true);
    returnItemToParent(e.target.value);
  };

  const handleItemSelect = (item: any) => {
    setFilter("");
    setVisibleValue(item);
    setDropdownOpen(false);
    returnItemToParent(item);
  };

  useEffect(() => {
    //setVisibleValue(defaultFilter);
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscAway);

    //Callback function to remove eventlisteners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleEscAway);
    };
  }, []);

  return (
    <div className="dropdown col-sm mx-1">
      <label className="form-label">{dropdownName}</label>
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={items[0].toString()}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        onChange={handleItemChange}
        value={visibleValue}
      />
      {dropdownOpen && (
        <ul ref={ulRef} className="list-group dropdown-menu show">
          {filteredItems.map((item) => (
            <li
              key={item.toString()}
              className="list-group-item list-group-item-action"
              onClick={() => handleItemSelect(item)}
            >
              {item.toString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredDropdown;
