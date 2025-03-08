import { Table } from "@radix-ui/themes";
import React from "react";
import { PiSortAscending, PiSortDescending } from "react-icons/pi";

function SortableColumnHeader({
  column,
  label,
  sortBy,
  sortDirection,
  sortToggle,
  sortable = false,
}) {
  const handleClick = () => {
    if (sortable) {
      sortToggle(column);
    }
  };

  return (
    <Table.ColumnHeaderCell onClick={handleClick}>
      <div
        className={`flex items-center gap-2 ${sortable && "cursor-pointer"}`}
      >
        {label}{" "}
        {sortable ? (
          sortBy === column ? (
            sortDirection === "DESC" ? (
              <PiSortDescending
                size={16}
                aria-label="Sorted descending"
                className="text-gray-900"
              />
            ) : (
              <PiSortAscending
                size={16}
                aria-label="Sorted ascending"
                className="text-gray-900"
              />
            )
          ) : (
            <PiSortDescending
              size={16}
              aria-label="Sorted descending"
              className="text-gray-400"
            />
          )
        ) : (
          ""
        )}
      </div>
    </Table.ColumnHeaderCell>
  );
}

export default SortableColumnHeader;
