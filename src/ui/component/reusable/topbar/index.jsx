import { Grid, TextField } from "@radix-ui/themes";
import React from "react";
import { PiMagnifyingGlassLight } from "react-icons/pi";

function Topbar() {
  return (
    <div className="border-b border-gray-950 bg-gray-800 text-gray-300 px-2 py-2 text-xs text-center">
      <Grid columns="3" gap="3" width="auto">
        <div className=""></div>
        <div className="">Top bar</div>
        <div className=""></div>
      </Grid>
    </div>
  );
}

export default Topbar;
