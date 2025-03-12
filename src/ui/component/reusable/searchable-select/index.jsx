import React, { useState, useRef, useEffect } from "react";

function SearchableSelect({
  options, // Array of objects (e.g., [{ name: "John", phone: "123" }, ...])
  onSelect, // Callback function to handle selection
  selectedValue, // Currently selected value (for controlled input)
  displayField = "name", // Field to display in the dropdown (default: "name")
  valueField = "phone", // Field to use as the value (default: "phone")
  placeholder = "Search...", // Placeholder text for the input field
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Ref for the dropdown container
  const dropdownRef = useRef(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option[displayField].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option) => {
    onSelect(option[valueField]); // Send the value field back to the parent
    setIsOpen(false);
    setSearchQuery("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // Re-run effect when isOpen changes

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input field for search */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery || selectedValue} // Show selected display field or search query
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 max-w-[300px] mt-2 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelect(option)} // Pass the entire option object
                className="px-2 py-1 rounded cursor-pointer hover:bg-blue-500 text-gray-600 hover:text-white whitespace-nowrap"
              >
                {option[displayField]} {/* Display the specified field */}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
