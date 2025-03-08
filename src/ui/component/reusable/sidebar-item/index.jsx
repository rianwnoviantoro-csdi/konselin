import { Tooltip } from "@radix-ui/themes";
import React from "react";

function SidebarItem({
  icon: Icon,
  isActive,
  onClick,
  tooltip,
  direction = "right",
}) {
  return (
    <Tooltip content={tooltip} side={direction}>
      <div
        className="relative flex items-center justify-center w-full gap-4 px-2 py-1 cursor-pointer transition-all duration-300 group"
        onClick={onClick}
      >
        <div
          className={`absolute left-0 top-0 h-full w-0.5 bg-white transition-all duration-300 ${
            isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
          }`}
        ></div>
        <Icon
          size={28}
          className={`transition-colors duration-300 group-hover:text-white ${
            isActive ? "text-white" : "text-gray-500"
          }`}
        />
      </div>
    </Tooltip>
  );
}

export default SidebarItem;
