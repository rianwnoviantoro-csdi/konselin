import { Grid } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { searchValue } from "../../../redux/feature/filter/slice";

function Topbar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const searchableRoute = [
    "/dashboard/account",
    "/dashboard/student",
    "/dashboard/counseling",
  ];

  useEffect(() => {
    dispatch(searchValue(search));
  }, [search]);

  useEffect(() => {
    setSearch("");
    dispatch(searchValue(""));
  }, [location.pathname, dispatch]);

  return (
    <div className="border-b border-gray-950 bg-gray-800 text-gray-300 px-2 py-2 text-xs text-center">
      <Grid
        columns="3"
        gap="3"
        width="auto"
        className="min-h-[30px] items-center"
      >
        <div className=""></div>
        <div className="">
          {searchableRoute.includes(location.pathname) && (
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full px-2 py-1 bg-white/5 border border-gray-600 rounded-md focus:outline-none text-sm"
            />
          )}
        </div>
        <div className=""></div>
      </Grid>
    </div>
  );
}

export default Topbar;
