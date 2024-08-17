import { useState } from "react";

interface FilteredDropdownProps {
  dropdownName: string;
  items: string[];
  returnItemToParent: (item: string) => void;
}

const FilteredDropdown = ({
  dropdownName,
  items,
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
    //set info to be passed back up
    returnItemToParent(e.target.value);
  };

  const handleItemSelect = (item: string) => {
    setFilter(item);
    setDropdownOpen(false);
    //set info to be passed back up
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
        placeholder={items[0]}
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
