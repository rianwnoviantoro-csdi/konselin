import React from "react";
import { Outlet } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { Reusable } from "..";

function Layout() {
  return (
    <Theme>
      <div className="bg-white h-screen flex flex-col">
        {/* Topbar */}
        <Reusable.Topbar />
        <div
          className="flex-1 flex overflow-hidden"
          style={{ height: "calc(100vh - 160px)" }}
        >
          <div className="w-[20%]">
            {/* Sidebar */}
            <Reusable.Sidebar />
          </div>

          <div className="w-[80%]">
            <Outlet />
          </div>
        </div>
        {/* Footer */}
        <Reusable.Footer />
      </div>
    </Theme>
  );
}

export default Layout;
