import {
  PiStudent,
  PiChalkboardTeacherLight,
  PiChatsCircleLight,
  PiCaretRightLight,
  PiSignOutLight,
  PiUserCircleLight,
} from "react-icons/pi";
import React, { useState } from "react";
import { Reusable } from "../..";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/feature/auth/slice";

function Sidebar() {
  const [active, setActive] = useState(1); // Track active icon
  const location = useLocation();
  const dispatch = useDispatch();

  // Define menu lists based on active icon
  const menuItems = {
    1: [
      { path: "/dashboard", label: "Dasbor" },
      { path: "/dashboard/counseling", label: "Lis Konseling" },
      { path: "/dashboard/counseling/create", label: "Konseling baru" },
    ],
    2: [
      { path: "/dashboard/student", label: "Lis peserta" },
      { path: "/dashboard/student/create", label: "Peserta baru" },
    ],
    3: [
      { path: "/dashboard/account", label: "Lis konsuler" },
      { path: "/dashboard/account/create", label: "Konsuler baru" },
    ],
    4: [{ path: "/dashboard/setting", label: "Ganti password" }],
  };

  // List of Sidebar Items
  const sidebarIcons = [
    { id: 1, bottom: false, icon: PiChatsCircleLight, tooltip: "Konseling" },
    { id: 2, bottom: false, icon: PiStudent, tooltip: "Peserta / Murid" },
    {
      id: 3,
      bottom: false,
      icon: PiChalkboardTeacherLight,
      tooltip: "Konsuler / Guru",
    },
    { id: 4, bottom: true, icon: PiUserCircleLight, tooltip: "Pengaturan" },
    { id: 5, bottom: true, icon: PiSignOutLight, tooltip: "Sign Out" },
  ];

  return (
    <div className="flex bg-gray-800 h-screen border-r border-gray-950">
      {/* Sidebar */}
      <div className="py-4 border-r border-gray-950 w-[20%] mb-14 flex flex-col items-center">
        {/* Main Icons */}
        <div className="flex flex-col gap-6 items-center w-full flex-1">
          {sidebarIcons
            .filter((item) => !item.bottom) // Render non-bottom icons first
            .map(({ id, icon, tooltip, bottom }) => (
              <Reusable.SidebarItem
                key={id}
                icon={icon}
                isActive={active === id}
                onClick={() => setActive(id)}
                tooltip={tooltip}
              />
            ))}
        </div>

        {/* Bottom Icons */}
        <div className="w-full flex flex-col gap-6">
          {sidebarIcons
            .filter((item) => item.bottom) // Render bottom icons last
            .map(({ id, icon, tooltip, bottom }) => (
              <Reusable.SidebarItem
                key={id}
                icon={icon}
                isActive={active === id}
                onClick={() => {
                  id === 5 ? dispatch(logout()) : setActive(id);
                }}
                tooltip={tooltip}
                bottom={bottom}
              />
            ))}
        </div>
      </div>

      {/* Main Content (Show Menu Based on Click) */}
      <div className="w-[80%] text-gray-300">
        <div className="px-2 py-3 border-b border-gray-950 uppercase text-xs tracking-widest">
          <p className="pl-5">Menu</p>
        </div>
        {active && (
          <ul className="">
            {menuItems[active]?.map((item, index) => (
              <Link key={index} to={item.path}>
                <li
                  className={`flex items-center gap-2 px-2 py-1.5 transition-colors duration-150 ${
                    location.pathname === item.path
                      ? "bg-white/15"
                      : "bg-white/5"
                  } hover:bg-white/10 border-b border-gray-950 uppercase font-semibold text-xs tracking-wider cursor-pointer`}
                >
                  <PiCaretRightLight size={12} />
                  {item.label}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
