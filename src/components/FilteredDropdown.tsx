import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../css/FilteredItems.css";

interface FilteredDropdownProps<T> {
  dropdownName: string;
  items: T[];
  defaultFilter: string;
  defaultValue: string;
  returnItemToParent: (item: T) => void;
}

/**
 * @param dropdownName the name for this dropdown, e.g. Products
 * @param items must be an array of objects with a toString() implementation and a unique id field
 * @param defaultFilter the value to initialize the filter with, typically ""
 * @param defaultValue the value to initialize the item displayed in the input text box
 * @param returnItemToParent the function this component will call when the user selects an item
 *
 */
const FilteredDropdown = <T extends { id: number; toString(): string }>({
  dropdownName,
  items,
  defaultFilter,
  defaultValue,
  returnItemToParent,
}: FilteredDropdownProps<T>) => {
  const ulRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const dropdownOpenRef = useRef<boolean>(false);
  const activeIndexRef = useRef<number | null>(null);
  const fiRef = useRef<T[]>(items);
  const [filter, setFilter] = useState(
    items.map((item) => item.toString()).includes(defaultFilter)
      ? ""
      : defaultFilter
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visibleValue, setVisibleValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const actionKeys = ["Escape", "Enter", "Tab", "ArrowUp", "ArrowDown"];

  //Generate the updated list of items filtered by the user input
  const filteredItems: T[] = useMemo(() => {
    return filter
      ? items.filter((item) => {
          return item
            .toString()
            .toLowerCase()
            .includes(filter.toString().toLowerCase());
        })
      : items;
  }, [items, filter]);

  //When user types in input field
  const handleItemChange = (e: any) => {
    setActiveIndex(null);
    setFilter(e.target.value);
    setVisibleValue(e.target.value);
    setDropdownOpen(true);
    returnItemToParent(e.target.value);
  };

  //When user clicks an item from the dropdown
  const handleItemSelect = (item: any) => {
    setActiveIndex(null);
    setFilter("");
    setVisibleValue(item);
    setDropdownOpen(false);
    returnItemToParent(item);
  };

  //Close dropdown when user clicks away from element
  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      if (ulRef.current && inputRef.current.contains(event.target)) {
        return;
      }
      if (ulRef.current && ulRef.current.contains(event.target)) {
        return;
      }
      setDropdownOpen(false);
      setActiveIndex(null);
    },
    [ulRef.current, inputRef.current]
  );

  //Close dropdown when user presses Escape
  //Change selected item when user enters arrow key up/down
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      //Just ignore if not a key tied to an action
      if (!actionKeys.includes(event.key)) {
        return;
      }

      //Allow user to tab to next dropdown
      if (dropdownOpenRef.current === false && event.key === "Tab") {
        return;
      }
      // Stop normal behavior of these keys
      event.preventDefault();

      //Escape
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setActiveIndex(null);
      } else {
        //Everything else, arrow up and down, tab and enter
        if (document.activeElement === inputRef.current) {
          if (dropdownOpenRef.current === false) {
            if (["ArrowUp", "ArrowDown"].includes(event.key)) {
              setDropdownOpen(true);
            }
          }

          //Arrow Up
          if (event.key === "ArrowUp") {
            setActiveIndex((prevIndex) => {
              if (prevIndex === null) {
                return null;
              } else if (prevIndex === 0) {
                return 0;
              } else {
                return prevIndex - 1;
              }
            });

            //Arrow Down
          } else if (event.key === "ArrowDown") {
            setActiveIndex((prevIndex) => {
              if (prevIndex === null) {
                return 0;
              } else if (prevIndex === fiRef.current.length - 1) {
                return prevIndex;
              } else {
                return prevIndex + 1;
              }
            });

            //Enter or Tab to select current active item
          } else if (event.key === "Enter" || event.key === "Tab") {
            if (activeIndexRef.current != null) {
              handleItemSelect(fiRef.current[activeIndexRef.current]);
              return;
            }
          }
        }
      }
    },
    [
      dropdownOpenRef.current,
      inputRef.current,
      activeIndexRef.current,
      fiRef.current,
    ]
  );

  //Found this scrollIntoView() function while trying to find a way to make arrow key scroll the dropdown items
  //https://codesandbox.io/p/sandbox/react-autocomplete-forked-0o1hll?file=%2Fsrc%2Fcomponents%2FAutocomplete.js%3A18%2C1
  //Had no idea that function existed, makes this much easier.
  function setChange() {
    const selected = ulRef?.current?.querySelector(".active"); //Grab the next <li> element with "active" in className
    console.log(selected);
    if (selected) {
      selected?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  //Update the status of the dropdown being open or not
  useEffect(() => {
    dropdownOpenRef.current = dropdownOpen;
  }, [dropdownOpen]);

  //Update the current active item in the dropdown selected by arrow keys
  useEffect(() => {
    activeIndexRef.current = activeIndex;
    setChange();
  }, [activeIndex]);

  //Update the current list of filteredItems
  useEffect(() => {
    fiRef.current = filteredItems;
  }, [filteredItems]);

  //Create the initial event listeners
  useEffect(() => {
    //setVisibleValue(defaultFilter);
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleKeyDown);

    //Callback function to remove eventlisteners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleKeyDown);
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
              key={item.id}
              className={`list-group-item list-group-item-action 
              ${
                activeIndex != null &&
                activeIndex < filteredItems.length &&
                filteredItems[activeIndex].id === item.id
                  ? "active"
                  : ""
              }`}
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
